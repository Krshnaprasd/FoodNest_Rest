const express = require("express");
const Order = require("../Model/Order");
const Cart = require("../Model/Cart");
const router = express.Router();
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

router.post("/add", async (req, res) => {
  try {
    const { userId, items, totalAmount, address, emailId } = req.body;

    if (!userId || !items || !totalAmount || !address || !emailId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const validTotalAmount = parseFloat(totalAmount);
    if (isNaN(validTotalAmount)) {
      return res.status(400).json({ message: "Invalid total amount" });
    }

    // Create a new order
    const newOrder = new Order({
      userId: new mongoose.Types.ObjectId(userId),
      items,
      totalAmount: validTotalAmount,
      address,
      emailId,
    });

    // Save the new order
    await newOrder.save();

    // Clear the cart after placing the order
    const userObjectId = new mongoose.Types.ObjectId(userId);
    await Cart.findOneAndUpdate(
      { userId: userObjectId },
      { items: [] } // Clear the cart items
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "krshnaprasdedextech@gmail.com",
        pass: "hder ammd ntad pgxm",
      },
    });

    const emailContent = `
            <h1>Order Confirmation</h1>
            <p>Thank you for your order! Here are the details:</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Items:</strong></p>
            <ul>
                ${items
                  .map(
                    (item) => `
                    <li>${item.name} - $${item.price} x ${item.quantity}</li>
                `
                  )
                  .join("")}
            </ul>
            <p><strong>Total Amount:</strong> $${validTotalAmount.toFixed(
              2
            )}</p>
        `;

    // Send the email
    await transporter.sendMail({
      from: "krshnaprasdedextech@gmail.com",
      to: emailId, // Send email to the provided emailId
      subject: "Order Confirmation",
      html: emailContent,
    });

    // Return success response
    res.status(201).json({
      message: "Order placed successfully and email sent!",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);

    if (
      (error.response && error.response.includes("ENOTFOUND")) ||
      error.code === "EENVELOPE"
    ) {
      return res
        .status(500)
        .json({ message: "Order placed, but email sending failed." });
    }

    res.status(500).json({ message: "Error placing order" });
  }
});



router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId });
    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this user." });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

module.exports = router;
