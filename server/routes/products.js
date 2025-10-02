const express = require("express");
const { body, validationResult } = require("express-validator");
const Product = require("../models/Product");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/products
// @desc    Create product
// @access  Private (Admin)
router.post(
  "/",
  adminAuth,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("category")
      .isIn(["protein", "supplements", "equipment", "clothing", "accessories"])
      .withMessage("Invalid category"),
    body("brand").trim().notEmpty().withMessage("Brand is required"),
    body("stock")
      .isInt({ min: 0 })
      .withMessage("Stock must be a positive number"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const product = new Product(req.body);
      await product.save();

      res.status(201).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Admin)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (Admin)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
