const nodemailer = require('nodemailer');
const orderConfirmationTemplate = require('../templates/orderConfirmation');
const shippingUpdateTemplate = require('../templates/shippingUpdate');
const passwordResetTemplate = require('../templates/passwordReset');
const lowStockAlertTemplate = require('../templates/lowStockAlert');
const welcomeNewsletterTemplate = require('../templates/welcomeNewsletter');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Base send function
const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Threadline" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`Email failed to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
};

// Send order confirmation
const sendOrderConfirmation = async (order, user) => {
  const { subject, html } = orderConfirmationTemplate(order, user);
  return sendEmail(user.email, subject, html);
};

// Send shipping update
const sendShippingUpdate = async (order, user, trackingNumber) => {
  const { subject, html } = shippingUpdateTemplate(order, user, trackingNumber);
  return sendEmail(user.email, subject, html);
};

// Send password reset
const sendPasswordReset = async (user, resetLink) => {
  const { subject, html } = passwordResetTemplate(user, resetLink);
  return sendEmail(user.email, subject, html);
};

// Send low stock alert to admin
const sendLowStockAlert = async (product, variant, stock) => {
  const { subject, html } = lowStockAlertTemplate(product, variant, stock);
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  return sendEmail(adminEmail, subject, html);
};

// Send welcome newsletter email to new subscriber
const sendWelcomeNewsletter = async (email) => {
  const { subject, html } = welcomeNewsletterTemplate(email);
  return sendEmail(email, subject, html);
};

module.exports = {
  sendOrderConfirmation,
  sendShippingUpdate,
  sendPasswordReset,
  sendLowStockAlert,
  sendWelcomeNewsletter,
};