const express = require('express');
const router = express.Router();

const Category = require('../Model/Category');

// Get all categories

router.post('/add', async (req, res) => {
    try {
      const category = new Category({
          name:req.body.name,
          image:req.body.image,
      });
      await category.save();
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

router.get('/all', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;