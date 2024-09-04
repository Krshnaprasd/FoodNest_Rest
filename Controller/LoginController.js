const express = require('express');
const router = express.Router();
const User = require('../Model/Signup');

// Login route
router.post('/check', async (req, res) => {
  try {
    // Find user by username
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Directly compare the password (no bcrypt)
    if (req.body.password === user.password) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(400).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
