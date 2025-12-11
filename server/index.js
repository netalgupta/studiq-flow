// server/index.js (ESM) - full server with Prisma, Socket.IO, Google auth, face matching
import express from "express";
import http from "http";
import cors from "cors";
import multer from "multer";
import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: ["http://localhost:8080", "http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

// multer for photo uploads (memory)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 6 * 1024 * 1024 } });

// middlewares
app.use(cors({ origin: ["http://localhost:8080", "http://localhost:3000"], credentials: true }));
app.use(express.json({ limit: "2mb" })); // for JSON embedding posts
app.use(express.urlencoded({ extended: true }));

// JWT + Google config
const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";

// small in-memory session store (keeps current active sessions) — persisted session info also in DB via ClassSession model
const sessions = {}; // { [classId]: { active, code, expiresAt, marks: [] } }

// helpers
function generateCode(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function cosineSimilarity(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return -1;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// JWT middleware
function requireAuth(roles = []) {
  return async (req, res, next) => {
    try {
      const auth = req.headers.authorization;
      if (!auth) return res.status(401).json({ error: "No token" });
      const token = auth.split(" ")[1] || auth;
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) return res.status(403).json({ error: "Forbidden" });
      next();
    } catch (err) {
      console.error("auth error", err);
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}

// Socket.IO handlers
io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  socket.on("join-class", ({ classId }) => {
    if (!classId) return;
    socket.join(`class:${classId}`);
    io.to(`class:${classId}`).emit("presence:change", { socketId: socket.id, classId, event: "joined", timestamp: new Date().toISOString() });
  });

  socket.on("leave-class", ({ classId }) => {
    if (!classId) return;
    socket.leave(`class:${classId}`);
    io.to(`class:${classId}`).emit("presence:change", { socketId: socket.id, classId, event: "left", timestamp: new Date().toISOString() });
  });

  socket.on("disconnecting", () => {
    const rooms = Array.from(socket.rooms).filter(r => r.startsWith("class:"));
    rooms.forEach(r => {
      io.to(r).emit("presence:change", { socketId: socket.id, classId: r.replace("class:", ""), event: "left", timestamp: new Date().toISOString() });
    });
  });
});

//
// AUTH ROUTES
//
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

app.post("/api/auth/google", async (req, res) => {
  try {
    const { idToken } = req.body || {};
    if (!idToken) return res.status(400).json({ error: "idToken required" });
    if (!googleClient) return res.status(500).json({ error: "Google client not configured" });

    const ticket = await googleClient.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const email = payload.email;
    const googleSub = payload.sub;
    const name = payload.name || (email ? email.split("@")[0] : "Unknown");

    // find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { email, name, googleSub, role: "STUDENT" } });
    } else if (!user.googleSub) {
      await prisma.user.update({ where: { email }, data: { googleSub } });
    }

    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error("google auth error", err);
    return res.status(500).json({ error: "Auth failed" });
  }
});

//
// USER ROUTES (admin & enrollment)
//
app.get("/api/users", requireAuth(["ADMIN"]), async (req, res) => {
  try {
    const users = await prisma.user.findMany({ include: { embeddings: true } });
    res.json(users);
  } catch (err) {
    console.error("list users err", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/users", requireAuth(["ADMIN"]), async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await prisma.user.create({ data: { name, email, role: role || "STUDENT" } });
    res.status(201).json(user);
  } catch (err) {
    console.error("create user err", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Enroll embedding for user (expects JSON body { embedding: number[] })
app.post("/api/users/:id/enroll-face", requireAuth([]), async (req, res) => {
  try {
    const id = req.params.id;
    const { embedding } = req.body || {};
    if (!embedding || !Array.isArray(embedding)) return res.status(400).json({ error: "embedding array required" });
    await prisma.embedding.create({ data: { userId: id, vector: JSON.stringify(embedding) } });
    return res.json({ ok: true });
  } catch (err) {
    console.error("enroll-face err", err);
    return res.status(500).json({ error: "Server error" });
  }
});

//
// CLASS / ATTENDANCE ROUTES
//

// Start session (teacher starts)
app.post("/api/classes/:id/start", requireAuth(["FACULTY", "ADMIN", "TEACHER"].filter(Boolean)), async (req, res) => {
  try {
    const id = String(req.params.id);
    const code = generateCode(6);
    const expiresAt = Date.now() + 1000 * 60 * 60;
    sessions[id] = sessions[id] || { marks: [] };
    sessions[id].active = true;
    sessions[id].code = code;
    sessions[id].expiresAt = expiresAt;

    // create or update ClassSession in DB
    await prisma.classSession.upsert({
      where: { id },
      update: { code, expiresAt: new Date(expiresAt), active: true },
      create: { id, code, expiresAt: new Date(expiresAt), active: true, title: `Session ${id}` },
    });

    io.to(`class:${id}`).emit("session:started", { classId: id, code, expiresAt, timestamp: new Date().toISOString() });
    return res.json({ ok: true, code, expiresAt });
  } catch (err) {
    console.error("start session err", err);
    return res.status(500).json({ ok: false, message: "Internal error" });
  }
});

// Regenerate code
app.post("/api/classes/:id/generate-code", requireAuth(["FACULTY", "ADMIN", "TEACHER"].filter(Boolean)), async (req, res) => {
  try {
    const id = String(req.params.id);
    const s = sessions[id];
    if (!s || !s.active) return res.status(400).json({ error: "Session not active" });
    const code = generateCode(6);
    s.code = code;
    s.expiresAt = Date.now() + 1000 * 60 * 60;
    await prisma.classSession.update({ where: { id }, data: { code, expiresAt: new Date(s.expiresAt) } });
    io.to(`class:${id}`).emit("session:regenerated", { classId: id, code: s.code, expiresAt: s.expiresAt, timestamp: new Date().toISOString() });
    return res.json({ code: s.code, expiresAt: s.expiresAt });
  } catch (err) {
    console.error("regen err", err);
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

// Attendance by code (student)
app.post("/api/classes/:id/attendance/code", async (req, res) => {
  try {
    const id = String(req.params.id);
    const { code, userId, name } = req.body || {};
    const s = sessions[id];
    if (!s || !s.active) return res.status(400).json({ status: "error", message: "Session not active" });
    if (!code) return res.status(400).json({ status: "error", message: "No code provided" });
    if (String(s.code).toUpperCase() !== String(code).trim().toUpperCase() || Date.now() > s.expiresAt) {
      return res.status(403).json({ status: "failed", message: "Invalid or expired code" });
    }

    // record attendance to DB
    const mark = await prisma.attendance.create({
      data: {
        sessionId: id,
        userId: userId || null,
        userName: name || null,
        method: "code",
        confidence: null,
      },
    });

    io.to(`class:${id}`).emit("attendance:update", { userId: mark.userId, name: mark.userName, method: "code", timestamp: mark.timestamp });
    return res.json({ status: "present", method: "code", timestamp: mark.timestamp });
  } catch (err) {
    console.error("attendance code err", err);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// Attendance by face - accepts JSON embedding (preferred) or multipart with 'photo' (not extracted server-side)
app.post("/api/classes/:id/attendance/face", upload.single("photo"), async (req, res) => {
  try {
    const id = String(req.params.id);
    const s = sessions[id];
    if (!s || !s.active) return res.status(400).json({ status: "error", message: "Session not active" });

    // Accept embedding from JSON body or form field 'embedding'
    let embedding = null;
    if (req.is("application/json") && req.body && req.body.embedding) {
      embedding = req.body.embedding;
    } else if (req.body && req.body.embedding) {
      try { embedding = typeof req.body.embedding === "string" ? JSON.parse(req.body.embedding) : req.body.embedding; } catch(e) { embedding = null; }
    }

    if (!embedding) {
      // If photo provided but embedding not provided, we don't do server-side face extraction here
      if (req.file && req.file.buffer) {
        return res.status(400).json({ status: "error", message: "Server-side face extraction not enabled. Send embedding from client." });
      }
      return res.status(400).json({ status: "error", message: "embedding required" });
    }

    // fetch all embeddings (in production, limit to class students)
    const allEmbeddings = await prisma.embedding.findMany({ include: { user: true } });

    let best = { score: -1, userId: null, userName: null };
    for (const e of allEmbeddings) {
      const vec = (typeof e.vector === "string") ? JSON.parse(e.vector) : e.vector;
      if (!Array.isArray(vec) || vec.length !== embedding.length) continue;
      const score = cosineSimilarity(embedding, vec);
      if (score > best.score) best = { score, userId: e.userId, userName: e.user?.name || e.user?.email || "Unknown" };
    }

    const THRESHOLD = 0.60;
    if (best.score >= THRESHOLD) {
      const att = await prisma.attendance.create({
        data: { sessionId: id, userId: best.userId, userName: best.userName, method: "face", confidence: best.score },
      });
      io.to(`class:${id}`).emit("attendance:update", { userId: att.userId, name: att.userName, method: "face", confidence: att.confidence, timestamp: att.timestamp });
      return res.json({ status: "present", confidence: best.score, userId: best.userId, userName: best.userName });
    } else {
      return res.status(403).json({ status: "failed", message: "No match", bestScore: best.score });
    }
  } catch (err) {
    console.error("attendance face err", err);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// End session
app.post("/api/classes/:id/end", requireAuth(["FACULTY", "ADMIN", "TEACHER"].filter(Boolean)), async (req, res) => {
  try {
    const id = String(req.params.id);
    const s = sessions[id];
    if (!s) return res.status(400).json({ ok: false, message: "No session" });
    s.active = false;
    await prisma.classSession.updateMany({ where: { id }, data: { active: false } }).catch(() => {});
    const endedAt = new Date().toISOString();
    io.to(`class:${id}`).emit("session:ended", { classId: id, endedAt });
    return res.json({ ok: true, endedAt });
  } catch (err) {
    console.error("end session err", err);
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

// Status endpoint
app.get("/api/classes/:id/status", async (req, res) => {
  const id = String(req.params.id);
  const s = sessions[id];
  if (!s || !s.active) return res.status(404).json({ active: false });
  return res.json({ active: true, code: s.code, expiresAt: s.expiresAt });
});

// Simple admin reports endpoint (CSV export of attendance)
app.get("/api/reports/attendance", requireAuth(["ADMIN"]), async (req, res) => {
  try {
    const rows = await prisma.attendance.findMany({ include: { session: true } , orderBy: { timestamp: "desc" } });
    let csv = "id,userId,userName,sessionId,method,confidence,timestamp\n";
    for (const r of rows) {
      csv += `${r.id},${r.userId ?? ""},${r.userName ?? ""},${r.sessionId},${r.method},${r.confidence ?? ""},${r.timestamp.toISOString()}\n`;
    }
    res.setHeader("Content-Type", "text/csv");
    res.send(csv);
  } catch (err) {
    console.error("reports err", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server + Socket.IO listening on :${PORT}`);
});
