const express = require('express');
const router = express.Router();
const User = require('../Model/Signup');

// Create a new employee
router.post('/addUser', async (req, res) => {
  try {
    const user = new User({
        username:req.body.username,
        email:req.body.email,
        mobileNo:req.body.mobileNo,
        password:req.body.password
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;