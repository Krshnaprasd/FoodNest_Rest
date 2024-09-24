const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const Cart = require("../Model/Cart")

router.post('/add', async (req, res) => {
    try {
      const { userId, product } = req.body;
  
      // Validate input
      if (!userId || !product || !product.productId || !product.name || !product.price) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const userObjectId = new mongoose.Types.ObjectId(userId);
  
      let cart = await Cart.findOne({ userId: userObjectId });
  
      if (cart) {
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === product.productId);
  
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += 1;
        } else {
          cart.items.push({ ...product, quantity: 1 });
        }
  
        cart = await cart.save();
        return res.status(200).json(cart);

      } else {
        const newCart = await Cart.create({
          userId: userObjectId,
          items: [{ ...product, quantity: 1 }]
        });
        return res.status(201).json(newCart);
      }
    } catch (error) {
      console.error('Error in /cart/add:', error.message); // Log the error
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
  

// router.get('/:userId', async (req, res) => {
//     try {
//       const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
//       if (!cart) {
//         return res.status(404).json({ message: 'Cart not found' });
//       }
//       return res.status(200).json(cart);
//     } catch (error) {
//       return res.status(500).json({ error: 'Something went wrong' });
//     }
//   });

router.get('/:userId', async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      return res.status(200).json(cart);
    } catch (error) {
      console.error('Error in /cart/:userId:', error);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  });

module.exports = router;