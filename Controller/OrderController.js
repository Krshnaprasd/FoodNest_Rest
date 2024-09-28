// routes/order.js
const express = require('express');
const Order = require('../Model/Order');
const Cart = require('../Model/Cart');
const router = express.Router();
const mongoose = require("mongoose");

// Create a new order
router.post('/add', async (req, res) => {
    try {
        const { userId, items, totalAmount, address } = req.body;

        // Validate input
        if (!userId || !items || !totalAmount || !address) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newOrder = new Order({
            userId: new mongoose.Types.ObjectId(userId), // Save userId
            items,
            totalAmount,
            address,
        });

        await newOrder.save();

        const userObjectId = new mongoose.Types.ObjectId(userId);
        await Cart.findOneAndUpdate(
          { userId: userObjectId }, // Find the user's cart by userId
          { items: [] }             // Clear the cart by setting items to an empty array
        );
        
        res.status(201).json({ message: 'Order placed successfully!', order: newOrder });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Error placing order' });
    }
});


router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await Order.find({ userId }); // Ensure the correct field is used to filter orders
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user.' });
        }
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});


module.exports = router;
