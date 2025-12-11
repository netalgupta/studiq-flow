// server/routes/classes.js
const express = require("express");
const multer = require("multer");

// Multer setup: memory storage but with file size limit (5MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const router = express.Router();

// allow JSON for all routes on this router
router.use(express.json());

// In-memory store for demo sessions & codes
// sessions = { [sessionId]: { active: bool, code: string, expiresAt: number, attempts: { ip: count }, marks: [] } }
const sessions = {};

// Simple brute-force protection thresholds (demo)
const MAX_ATTEMPTS_PER_IP = 10;
const ATTEMPT_WINDOW_MS = 1000 * 60 * 10; // 10 minutes

function generateCode(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // avoid ambiguous chars
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function now() {
  return Date.now();
}

// helper: ensure session object exists (create minimal if not)
function ensureSession(id) {
  if (!sessions[id]) {
    sessions[id] = {
      active: false,
      code: null,
      expiresAt: 0,
      attempts: {}, // { ip: [timestamps...] }
      marks: [], // store attendance marks for demo
    };
  }
  return sessions[id];
}

// helper: record attempt and return whether allowed
function recordAttempt(session, ip) {
  const t = now();
  if (!session.attempts[ip]) session.attempts[ip] = [];
  // prune old
  session.attempts[ip] = session.attempts[ip].filter((ts) => t - ts < ATTEMPT_WINDOW_MS);
  session.attempts[ip].push(t);
  return session.attempts[ip].length <= MAX_ATTEMPTS_PER_IP;
}

/**
 * Start a session (teacher/admin starts class)
 * POST /:id/start
 * returns { ok: true, code, expiresAt }
 */
router.post("/:id/start", (req, res) => {
  try {
    const id = String(req.params.id);
    const code = generateCode(6);
    const expiresAt = Date.now() + 1000 * 60 * 60; // 1 hour
    const s = ensureSession(id);
    s.active = true;
    s.code = code;
    s.expiresAt = expiresAt;
    s.marks = s.marks || [];
    // Optionally clear attempts
    s.attempts = {};
    // TODO: emit socket event "session:started" (if you have io)
    return res.json({ ok: true, code, expiresAt });
  } catch (err) {
    console.error("start session error", err);
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

/**
 * Regenerate code
 * POST /:id/generate-code
 * returns { code, expiresAt }
 */
router.post("/:id/generate-code", (req, res) => {
  try {
    const id = String(req.params.id);
    const s = ensureSession(id);
    if (!s.active) return res.status(400).json({ error: "Session not active" });
    const code = generateCode(6);
    s.code = code;
    s.expiresAt = Date.now() + 1000 * 60 * 60;
    // TODO: emit event to clients
    return res.json({ code, expiresAt: s.expiresAt });
  } catch (err) {
    console.error("generate-code error", err);
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

/**
 * Validate alphanumeric code and mark attendance
 * POST /:id/attendance/code
 * body: { code: "ABC123" }
 */
router.post("/:id/attendance/code", (req, res) => {
  try {
    const id = String(req.params.id);
    const clientIp = req.ip || req.connection.remoteAddress || "unknown";
    const { code } = req.body || {};

    const s = ensureSession(id);
    if (!s.active) return res.status(400).json({ status: "error", message: "Session not active" });
    if (!code || typeof code !== "string") return res.status(400).json({ status: "error", message: "No code provided" });

    // record attempt and block if too many
    const allowed = recordAttempt(s, clientIp);
    if (!allowed) {
      return res.status(429).json({ status: "error", message: "Too many attempts. Try later." });
    }

    // normalize compare (case-insensitive)
    if (!s.code || s.code.toUpperCase() !== code.trim().toUpperCase() || Date.now() > s.expiresAt) {
      return res.status(403).json({ status: "failed", message: "Invalid or expired code" });
    }

    // Mark attendance (demo): push into s.marks. In real app, persist to DB.
    const mark = {
      userId: req.body.userId || req.headers["x-user-id"] || "demo-user",
      method: "code",
      timestamp: new Date().toISOString(),
    };
    s.marks.push(mark);

    // TODO: emit socket.io 'attendance:update' to room/class using io if available

    return res.json({ status: "present", method: "code", timestamp: mark.timestamp });
  } catch (err) {
    console.error("attendance code error", err);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

/**
 * Face (selfie) attendance endpoint
 * POST /:id/attendance/face
 * multipart/form-data: photo=file, optional method field
 */
router.post("/:id/attendance/face", upload.single("photo"), async (req, res) => {
  try {
    const id = String(req.params.id);
    const s = ensureSession(id);
    if (!s.active) return res.status(400).json({ status: "error", message: "Session not active" });

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ status: "error", message: "No photo uploaded" });
    }

    // TODO: integrate face recognition here.
    // For demo we return present with mock confidence.
    const mark = {
      userId: req.body.userId || req.headers["x-user-id"] || "demo-user",
      method: req.body.method || "face",
      confidence: 0.92,
      timestamp: new Date().toISOString(),
    };
    s.marks.push(mark);

    // TODO: emit 'attendance:update' through socket.io if you have io

    return res.json({ status: "present", confidence: mark.confidence, method: mark.method, timestamp: mark.timestamp });
  } catch (err) {
    console.error("attendance face error", err);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

/**
 * End session
 * POST /:id/end
 */
router.post("/:id/end", (req, res) => {
  try {
    const id = String(req.params.id);
    const s = sessions[id];
    if (!s) return res.status(400).json({ ok: false, message: "No session" });
    s.active = false;
    // optionally delete code
    s.code = null;
    // TODO: emit socket event 'session:ended' with io
    return res.json({ ok: true, endedAt: new Date().toISOString() });
  } catch (err) {
    console.error("end session error", err);
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

module.exports = router;
