const Newsletter = require('../models/Newsletter');
const { sendSuccess, sendError } = require('../utils/response');
const { sendWelcomeNewsletter } = require('../services/emailService');
const logger = require('../utils/logger');

// POST /newsletter/subscribe
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Step 1 — Check if email field is present
    if (!email) {
      return sendError(res, 'Email is required', 400);
    }

    // Step 2 — Validate email format using regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return sendError(res, 'Please provide a valid email address', 400);
    }

    // Step 3 — Check for duplicate email in DB
    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      return sendError(res, 'This email is already subscribed', 409);
    }

    // Step 4 — Save new subscriber to DB
    const subscriber = await Newsletter.create({ email });

    // Step 5 — Send welcome email via Nodemailer
    try {
      const emailResult = await sendWelcomeNewsletter(email);
      if (emailResult.success) {
        logger.info(`📧 Welcome newsletter sent to ${email} (messageId: ${emailResult.messageId})`);
      } else {
        // Email failed but subscription still saved — log and continue
        logger.warn(`📧 Welcome email failed for ${email}: ${emailResult.error}`);
      }
    } catch (emailErr) {
      // Non-blocking — subscription succeeds even if email delivery fails
      logger.warn(`📧 Email service error for ${email}: ${emailErr.message}`);
    }

    // Step 6 — Return success response
    sendSuccess(
      res,
      { email: subscriber.email, subscribedAt: subscriber.subscribedAt },
      'Successfully subscribed to Threadline newsletter',
      201
    );

    } catch (err) {
    console.error('[Newsletter] subscribe error:', err);
    sendError(res, 'Something went wrong. Please try again.', 500);
  }
};