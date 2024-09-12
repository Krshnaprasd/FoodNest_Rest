const express = require('express');
const router = express.Router();
const Product = require('../Model/Product');

// Create a new product
router.post('/add', async (req, res) => {
    try {
      const product = new Product ({
          name:req.body.name,
          image:req.body.image,
          price:req.body.price,
          category: req.body.category
      });
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

 // Fetch products with optional category filter
router.get('/', async (req, res) => {
  try {
      const { categoryId } = req.query; // Get categoryId from query parameters
      let products;
      if (categoryId) {
          // Fetch products filtered by category
          products = await Product.find({ category: categoryId }).populate('category');
      } else {
          // Fetch all products
          products = await Product.find({}).populate('category');
      }
      res.status(200).json(products);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

module.exports = router;
  
