const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
        image: String  // Add the image field here
      }
    ]
  });

module.exports = mongoose.model("Cart",cartSchema);