// server/routes/admin.js
const express = require("express");
const router = express.Router();

// In-memory demo store
let users = [
  { id: "1", name: "Alice Student", email: "alice@example.com", role: "student" },
  { id: "2", name: "Bob Faculty", email: "bob@example.com", role: "faculty" },
];

router.get("/users", (req, res) => {
  res.json(users);
});

router.post("/users", express.json(), (req, res) => {
  const { name, email, role } = req.body;
  const id = String(Date.now());
  const newUser = { id, name, email, role };
  users.unshift(newUser);
  return res.status(201).json(newUser);
});

router.put("/users/:id", express.json(), (req, res) => {
  const { id } = req.params;
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  users[idx] = { ...users[idx], ...req.body };
  return res.json(users[idx]);
});

router.delete("/users/:id", (req, res) => {
  users = users.filter((u) => u.id !== req.params.id);
  return res.status(204).send();
});

module.exports = router;
