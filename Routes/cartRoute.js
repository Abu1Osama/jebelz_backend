const express = require("express");
const router = express.Router();
const User = require("../Models/user.model");
const Product = require("../Models/Product.models");
const { verifyUserToken } = require("../Middleware/auth");

router.post("/addcart/:productId", verifyUserToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.userId);

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    const existingCartItem = user.cart.find((item) =>
      item.product.equals(productId)
    );
    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      user.cart.push({ product: productId });
    }

    await user.save();

    res.json({ message: "Product added to cart." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred." });
  }
});

router.get("/cart", verifyUserToken, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate("cart.product");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user.cart);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the cart." });
  }
});

router.put("/update-quantity/:productId", verifyUserToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    const cartItem = user.cart.find((item) => item.product.equals(productId));

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found." });
    }

    cartItem.quantity = quantity;
    await user.save();

    res.json({ message: "Cart item quantity updated." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred." });
  }
});

router.delete("/removecart/:productId", verifyUserToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;

    const user = await User.findById(userId);
    user.cart = user.cart.filter((item) => !item.product.equals(productId));
    await user.save();

    res.json({ message: "Cart item removed." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred." });
  }
});

router.delete("/clear-cart", verifyUserToken, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    user.cart = [];
    await user.save();

    res.json({ message: "Cart cleared." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred." });
  }
});

module.exports = router;
