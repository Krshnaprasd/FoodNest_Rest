const express = require('express');
const mongoose = require('mongoose');
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

 
 router.get('/', async (req, res) => {
  const { categoryId, page = 1, limit = 15 } = req.query;
  const skip = (page - 1) * limit;



  try {
      
      const query = categoryId ? { category: new mongoose.Types.ObjectId(categoryId) } : {};
      const products = await Product.find(query).skip(skip).limit(Number(limit));
      const total = await Product.countDocuments(query);

      res.json({ products, total });  
  } catch (error) {
      console.error("Error fetching products:", error); 
      res.status(500).json({ error: 'Something went wrong' });
  }
});

router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const products = await Product.find().skip(skip).limit(Number(limit));
    const total = await Product.countDocuments();

    res.json({ products, total });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.delete('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    await Product.findByIdAndDelete(productId);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});


module.exports = router;
  
