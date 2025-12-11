// server/routes/auth.js (ESM)
import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/db.js";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body || {};
    if (!idToken) return res.status(400).json({ error: "idToken required" });

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const googleSub = payload.sub;
    const name = payload.name || payload.email.split("@")[0];

    // find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email, name, googleSub, role: "STUDENT" }, // default role STUDENT; admin must be set by admin
      });
    } else if (!user.googleSub) {
      // update googleSub if missing
      await prisma.user.update({ where: { email }, data: { googleSub } });
    }

    // sign JWT
    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    return res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error("google auth error", err);
    return res.status(500).json({ error: "Auth failed" });
  }
});

export default router;
