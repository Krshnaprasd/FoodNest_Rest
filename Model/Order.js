const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
 
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true, },
  address: { type: String, required: true,},
  createdAt: { type: Date, default: Date.now, },
});

module.exports = mongoose.model("Order", orderSchema);
