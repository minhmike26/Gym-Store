const { Router } = require("express");
const { body, param } = require("express-validator");
const Order = require("../models/Order");
const Product = require("../models/Product");

const router = Router();

router.post(
  "/",
  [
    body("userId").isString().notEmpty(),
    body("items").isArray({ min: 1 }),
    body("shippingAddress").isObject(),
  ],
  async (req, res) => {
    const { userId, items, shippingAddress } = req.body;
    const products = await Product.find({
      _id: { $in: items.map((i) => i.product) },
    });
    const idToProduct = new Map(products.map((p) => [String(p._id), p]));

    let itemsPrice = 0;
    const orderItems = items.map((i) => {
      const p = idToProduct.get(String(i.product));
      const lineTotal = (p?.price || 0) * i.quantity;
      itemsPrice += lineTotal;
      return {
        product: i.product,
        name: p?.name || i.name,
        quantity: i.quantity,
        price: p?.price || i.price,
        imageUrl: p?.imageUrl || i.imageUrl,
      };
    });
    const shippingPrice = 0;
    const totalPrice = itemsPrice + shippingPrice;

    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      totalPrice,
      paymentMethod: "VNPAY",
    });

    res.status(201).json(order);
  }
);

router.get("/:id", [param("id").isMongoId()], async (req, res) => {
  const order = await Order.findById(req.params.id).populate("items.product");
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

module.exports = router;
