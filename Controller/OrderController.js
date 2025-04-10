// const express = require("express");
// const Order = require("../Model/Order");
// const Cart = require("../Model/Cart");
// const router = express.Router();
// const mongoose = require("mongoose");
// const nodemailer = require("nodemailer");

// router.post("/add", async (req, res) => {
//   try {
//     const { userId, items, totalAmount, address, emailId } = req.body;

//     if (!userId || !items || !totalAmount || !address || !emailId) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const validTotalAmount = parseFloat(totalAmount);
//     if (isNaN(validTotalAmount)) {
//       return res.status(400).json({ message: "Invalid total amount" });
//     }

//     // Create a new order
//     const newOrder = new Order({
//       userId: new mongoose.Types.ObjectId(userId),
//       items,
//       totalAmount: validTotalAmount,
//       address,
//       emailId,
//     });

//     // Save the new order
//     await newOrder.save();

//     // Clear the cart after placing the order
//     const userObjectId = new mongoose.Types.ObjectId(userId);
//     await Cart.findOneAndUpdate(
//       { userId: userObjectId },
//       { items: [] } // Clear the cart items
//     );

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "krshnaprasdedextech@gmail.com",
//         pass: "hder ammd ntad pgxm",
//       },
//     });

//     const emailContent = `
//             <h1>Order Confirmation</h1>
//             <p>Thank you for your order! Here are the details:</p>
//             <p><strong>Address:</strong> ${address}</p>
//             <p><strong>Items:</strong></p>
//             <ul>
//                 ${items
//                   .map(
//                     (item) => `
//                     <li>${item.name} - $${item.price} x ${item.quantity}</li>
//                 `
//                   )
//                   .join("")}
//             </ul>
//             <p><strong>Total Amount:</strong> $${validTotalAmount.toFixed(
//               2
//             )}</p>
//         `;

//     // Send the email
//     await transporter.sendMail({
//       from: "krshnaprasdedextech@gmail.com",
//       to: emailId, // Send email to the provided emailId
//       subject: "Order Confirmation",
//       html: emailContent,
//     });

//     // Return success response
//     res.status(201).json({
//       message: "Order placed successfully and email sent!",
//       order: newOrder,
//     });
//   } catch (error) {
//     console.error("Error placing order:", error);

//     if (
//       (error.response && error.response.includes("ENOTFOUND")) ||
//       error.code === "EENVELOPE"
//     ) {
//       return res
//         .status(500)
//         .json({ message: "Order placed, but email sending failed." });
//     }

//     res.status(500).json({ message: "Error placing order" });
//   }
// });



// router.get("/:userId", async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const orders = await Order.find({ userId });
//     if (orders.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No orders found for this user." });
//     }
//     res.status(200).json(orders);
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ message: "Error fetching orders" });
//   }
// });

// module.exports = router;






















const express = require("express");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const Order = require("../Model/Order");
const Cart = require("../Model/Cart");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const router = express.Router();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: "rzp_test_eAQoP8Cti3tOBH",
  key_secret: "7oHakWV6CITC78mZFAmVANH5",
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "krshnaprasdedextech@gmail.com",
    pass: "hder ammd ntad pgxm",
  },
});

// Send Order Email
const sendOrderEmail = async (emailId, orderDetails, paymentMethod) => {
  const emailContent = `
    <h1>Order Confirmation</h1>
    <p>Thank you for your order! Here are the details:</p>
    <p><strong>Address:</strong> ${orderDetails.address}</p>
    <p><strong>Items:</strong></p>
    <ul>
      ${orderDetails.items
        .map((item) => `<li>${item.name} - ₹${item.price} x ${item.quantity}</li>`)
        .join("")}
    </ul>
    <p><strong>Total Amount:</strong> ₹${parseFloat(orderDetails.totalAmount).toFixed(2)}</p>
    <p><strong>Payment Method:</strong> ${paymentMethod}</p>
  `;

  await transporter.sendMail({
    from: "krshnaprasdedextech@gmail.com",
    to: emailId,
    subject: `Order Confirmation - ${paymentMethod}`,
    html: emailContent,
  });
};

// **1. Cash on Delivery (COD)**
router.post("/cod", async (req, res) => {
  try {
    const { userId, items, totalAmount, address, emailId } = req.body;
    if (!userId || !items || !totalAmount || !address || !emailId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newOrder = new Order({
      userId: new mongoose.Types.ObjectId(userId),
      items,
      totalAmount: parseFloat(totalAmount),
      address,
      emailId,
      status: "Pending - Cash on Delivery",
    });
    await newOrder.save();

        // Clear the cart after placing the order
    const userObjectId = new mongoose.Types.ObjectId(userId);
    await Cart.findOneAndUpdate(
      { userId: userObjectId },
      { items: [] } // Clear the cart items
    );

    await sendOrderEmail(emailId, newOrder, "Cash on Delivery");

    res.status(201).json({
      message: "Order placed successfully! Pay on delivery.",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing COD order:", error);
    res.status(500).json({ message: "Error placing COD order" });
  }
});

// **2. Create Razorpay Order (QR, UPI, Card)**
router.post("/pay-online", async (req, res) => {
  try {
    const { userId, items, totalAmount, address, emailId } = req.body;
    if (!userId || !items || !totalAmount || !address || !emailId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const validTotalAmount = parseFloat(totalAmount) * 100; // Convert to paise

    const razorpayOrder = await razorpay.orders.create({
      amount: validTotalAmount,
      currency: "INR",
      receipt: `order_${Date.now()}`,
      payment_capture: 1,
      notes: {
        paymentMethod: "Online Payment",
      },
    });

    res.status(200).json({
      message: "Razorpay order created",
      orderId: razorpayOrder.id,
      amount: validTotalAmount,
      currency: "INR",
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Error creating Razorpay order" });
  }
});

// **3. Verify Razorpay Payment**
router.post("/verify-payment", async (req, res) => {
  try {
    const { userId, items, totalAmount, address, emailId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!userId || !items || !totalAmount || !address || !emailId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verify Signature using Crypto
    const expectedSignature = crypto
      .createHmac("sha256", "7oHakWV6CITC78mZFAmVANH5")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const newOrder = new Order({
      userId: new mongoose.Types.ObjectId(userId),
      items,
      totalAmount: parseFloat(totalAmount),
      address,
      emailId,
      status: "Paid - Online",
      paymentId: razorpay_payment_id,
    });

    await newOrder.save();

    //     // Clear the cart after placing the order
    const userObjectId = new mongoose.Types.ObjectId(userId);
    await Cart.findOneAndUpdate(
      { userId: userObjectId },
      { items: [] } // Clear the cart items
    );

    await sendOrderEmail(emailId, newOrder, "Online Payment");

    res.status(201).json({
      message: "Payment successful! Order placed.",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Error verifying payment" });
  }
});

// **4. Get user orders**
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ userId });
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user." });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

module.exports = router;
