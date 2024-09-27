const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const Cart = require("../Model/Cart")

router.post('/add', async (req, res) => {
    try {
        const { userId, product } = req.body;
        
        // Validate input
        if (!userId || !product || !product.productId || !product.name || !product.price || !product.image) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);

        let cart = await Cart.findOne({ userId: userObjectId });

        if (cart) {
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === product.productId);

            if (itemIndex > -1) {
                // If product exists in the cart, increase the quantity
                cart.items[itemIndex].quantity += 1;
            } else {
                // If product doesn't exist in the cart, add a new item
                cart.items.push({ ...product, quantity: 1 });
            }

            cart = await cart.save();
            return res.status(200).json(cart);
        } else {
            // Create a new cart if it doesn't exist
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

  router.post('/update', async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;
  
      if (!userId || !productId || quantity < 1) {
        return res.status(400).json({ message: 'Invalid input' });
      }
  
      const userObjectId = new mongoose.Types.ObjectId(userId);
      let cart = await Cart.findOne({ userId: userObjectId });
  
      if (cart) {
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity = quantity;
          cart = await cart.save();
          return res.status(200).json(cart);
        }
      }
  
      return res.status(404).json({ message: 'Item not found in cart' });
    } catch (error) {
      console.error('Error in /cart/update:', error.message);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
  
  router.delete('/:userId/remove', async (req, res) => {
    try {
      const { userId } = req.params;
      const { productId } = req.body;
  
      if (!userId || !productId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const userObjectId = new mongoose.Types.ObjectId(userId);
      let cart = await Cart.findOne({ userId: userObjectId });
  
      if (cart) {
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
  
        cart = await cart.save();
        return res.status(200).json(cart);
      } else {
        return res.status(404).json({ message: 'Cart not found' });
      }
    } catch (error) {
      console.error('Error in /cart/remove:', error.message);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
  

module.exports = router;