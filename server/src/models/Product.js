const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    description: { type: String },
    imageUrl: { type: String },
    flavor: { type: String },
    proteinPerServing: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
