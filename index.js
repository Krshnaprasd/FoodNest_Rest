const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

// Environment configuration
const PORT = process.env.PORT || 5050;
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/FoodNest";

// Start server
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});

// Connect to MongoDB
mongoose.connect(MONGODB_URL)
    .then(() => {
        console.log("Connection successful: " + MONGODB_URL);
    })
    .catch((err) => {
        console.error("Error in connecting:", err.message);
    });

// Middleware
app.use(express.json());

// CORS configuration
app.use(cors({
    origin: "*"
}));

// Routes
const UserRouter = require('./Controller/SignupController');
const LoginRouter = require('./Controller/LoginController');
const ProductRouter = require('./Controller/ProductController');
const CategoryRouter = require('./Controller/CategoryController');
const CartRouter = require('./Controller/CartController');
const OrderRouter = require('./Controller/OrderController');
const BookRouter = require('./Controller/BookingController');

// API endpoints
app.use('/Signup', UserRouter);
app.use('/login', LoginRouter);
app.use('/product', ProductRouter);
app.use('/category', CategoryRouter);
app.use('/cart', CartRouter);
app.use('/order', OrderRouter);
app.use('/book', BookRouter);
