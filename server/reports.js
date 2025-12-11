// server/routes/reports.js
const express = require("express");
const router = express.Router();

router.get("/attendance", (req, res) => {
  const csv = `id,name,email,course,date,status
1,Alice Student,alice@example.com,Math,2025-11-01,present
2,Bob Faculty,bob@example.com,Math,2025-11-01,absent
`;
  res.setHeader("Content-Type", "text/csv");
  res.send(csv);
});

module.exports = router;
