const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

module.exports = router;
