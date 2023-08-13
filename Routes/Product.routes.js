// routes/products.js
const express = require("express");
const router = express.Router();
const Product = require("../Models/Product.models");

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching products." });
  }
});

// Create a new product
router.post("/", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ error: "Failed to create the product." });
  }
});

// Get product by ID
router.get("/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the product." });
  }
});

// Update product by ID
router.put("/:productId", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: "Failed to update the product." });
  }
});

// Delete product by ID
router.delete("/:productId", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndRemove(req.params.productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.json({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete the product." });
  }
});

module.exports = router;
