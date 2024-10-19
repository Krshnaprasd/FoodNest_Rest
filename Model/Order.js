const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            image: { type: String, required: true }
        },
    ],
    totalAmount: { type: Number, required: true },
    address: { type: String, required: true },
    emailId: { type: String, required: true },  // Add email field
  
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);

