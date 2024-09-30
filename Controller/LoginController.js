const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../Model/Signup');

// Login route
router.post('/check', async (req, res) => {
  try {
  
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    if (req.body.password === user.password) {
      res.status(200).json({
        _id: user._id,
        username: user.username,
        message: 'Login successful'
      });
   
    } else {
      res.status(400).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
