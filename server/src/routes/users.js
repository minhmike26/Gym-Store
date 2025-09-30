const { Router } = require("express");
const { body, param } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = Router();

router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const existing = await User.findOne({ email: req.body.email });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      passwordHash,
    });
    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  }
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { sub: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  }
);

router.get("/", requireAuth, requireAdmin, async (req, res) => {
  const users = await User.find()
    .sort({ createdAt: -1 })
    .select("-passwordHash");
  res.json(users);
});

router.delete(
  "/:id",
  [param("id").isMongoId()],
  requireAuth,
  requireAdmin,
  async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  }
);

module.exports = router;
