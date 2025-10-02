const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ["protein", "supplements", "equipment", "clothing", "accessories"],
    },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    brand: {
      type: String,
      required: true,
    },
    weight: String,
    flavor: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
