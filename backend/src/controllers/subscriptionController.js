import nodemailer from "nodemailer";
import Subscription from "../models/Subscription.js";

function buildTransport() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);

  if (!user || !pass || !host) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const upsertResult = await Subscription.updateOne(
      { email: normalizedEmail },
      { $setOnInsert: { email: normalizedEmail } },
      { upsert: true },
    );

    const alreadySubscribed = upsertResult.upsertedCount === 0;
    if (alreadySubscribed) {
      return res.status(200).json({
        success: true,
        alreadySubscribed: true,
        message: "This email is already subscribed.",
      });
    }

    const transporter = buildTransport();
    let emailSent = false;
    let message = "Subscription successful.";

    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: normalizedEmail,
          subject: "Welcome to SizeWise updates",
          text: "Thanks for subscribing to SizeWise. You will now receive updates and exclusive offers.",
        });
        emailSent = true;
        message = "Subscription successful. Please check your email.";
      } catch (mailError) {
        console.error("Subscription email send error:", mailError.message);
        message = "Subscription successful, but we could not send the email confirmation.";
      }
    }

    return res.status(201).json({
      success: true,
      alreadySubscribed: false,
      emailSent,
      message,
    });
  } catch (err) {
    console.error("Subscription error:", err);
    return res.status(500).json({ success: false, message: "Subscription failed", error: err.message });
  }
};
