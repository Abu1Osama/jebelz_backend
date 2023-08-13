const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  category: {
    type: String,
  },
  subcategory: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  description:[
    {
      type: String,
    },
  ],
  price: {
    type: Number,
    required: true,
  },

  imageUrls: [
    {
      type: String,
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
