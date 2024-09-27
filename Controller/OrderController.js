// routes/order.js
const express = require('express');
const Order = require('../Model/Order');
const router = express.Router();
 // Middleware to verify user authentication

// Create a new order
router.post('/add', async (req, res) => {
  const { items, totalAmount, address } = req.body;
 

  try {
    const newOrder = new Order({
    
      items,
      totalAmount,
      address,
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully!', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
