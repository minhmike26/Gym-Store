const { Router } = require("express");
const { body, param } = require("express-validator");
const Product = require("../models/Product");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = Router();

router.get("/", async (req, res) => {
  const { q } = req.query;
  const filter = q
    ? { $or: [{ name: new RegExp(q, "i") }, { brand: new RegExp(q, "i") }] }
    : {};
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
});

router.get("/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

router.post(
  "/",
  [
    body("name").isString().notEmpty(),
    body("slug").isString().notEmpty(),
    body("brand").isString().notEmpty(),
    body("price").isFloat({ min: 0 }),
    body("stock").isInt({ min: 0 }),
  ],
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  }
);

router.put(
  "/:id",
  [param("id").isMongoId()],
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  }
);

router.delete(
  "/:id",
  [param("id").isMongoId()],
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Deleted" });
  }
);

module.exports = router;
