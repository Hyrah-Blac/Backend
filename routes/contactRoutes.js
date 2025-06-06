import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Contact form route
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const mailOptions = {
    from: `"Dressin Contact" <${email}>`,
    to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
    subject: "New Contact Form Submission",
    text: `
Name: ${name}
Email: ${email}

Message:
${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message received successfully" });
  } catch (error) {
    console.error("📧 Error sending email:", error.message);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;