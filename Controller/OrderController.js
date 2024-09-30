
const express = require('express');
const Order = require('../Model/Order');
const Cart = require('../Model/Cart');
const router = express.Router();
const mongoose = require("mongoose");


router.post('/add', async (req, res) => {
    try {
        const { userId, items, totalAmount, address } = req.body;

        if (!userId || !items || !totalAmount || !address) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newOrder = new Order({
            userId: new mongoose.Types.ObjectId(userId),
            items,
            totalAmount,
            address,
        });

        await newOrder.save();

        const userObjectId = new mongoose.Types.ObjectId(userId);
        await Cart.findOneAndUpdate(
          { userId: userObjectId }, 
          { items: [] }             
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
        const orders = await Order.find({ userId }); 
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
