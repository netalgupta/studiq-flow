// server/routes/users.js (ESM)
import express from "express";
import { prisma } from "../lib/db.js";

const router = express.Router();

// list users (admin)
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany({ include: { embeddings: true } });
  res.json(users);
});

// create user (admin)
router.post("/", async (req, res) => {
  const { name, email, role } = req.body;
  const user = await prisma.user.create({ data: { name, email, role } });
  res.status(201).json(user);
});

// enroll face embedding
router.post("/:id/enroll-face", async (req, res) => {
  // Expect body: { embedding: number[] }
  const id = req.params.id;
  const { embedding } = req.body || {};
  if (!embedding || !Array.isArray(embedding)) return res.status(400).json({ error: "embedding (array) required" });
  await prisma.embedding.create({ data: { userId: id, vector: embedding } });
  res.json({ ok: true });
});

// get user embeddings
router.get("/:id/embeddings", async (req, res) => {
  const id = req.params.id;
  const embs = await prisma.embedding.findMany({ where: { userId: id } });
  res.json(embs);
});

export default router;
