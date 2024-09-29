const express = require('express');
const router = express.Router();
const Booking = require('../Model/Booking');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

router.post('/add', async (req, res) => {
    const { userId, name, email, guests, date, time } = req.body;

    try {
        // Save reservation to the database
        const newBooking = new Booking({ userId, name, email, guests, date, time });
        await newBooking.save();

        // Send email notification using Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'krshnaprasdedextech@gmail.com',  // Your email
                pass: 'hder ammd ntad pgxm'    // Your password
            }
        });

        const mailOptions = {
            from: 'krshnaprasdedextech@gmail.com',
            to: email,   // Send to the user
            subject: 'Reservation Confirmation',
            text: `Dear ${name},\n\nYour reservation for ${guests} guests on ${date} at ${time} is confirmed!\n\nThank you for booking with us.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Failed to send email' });
            } else {
                return res.status(200).json({ message: 'Reservation saved and email sent!' });
            }
        });

    } catch (error) {
        console.error('Error creating reservation:', error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
});

module.exports = router;
