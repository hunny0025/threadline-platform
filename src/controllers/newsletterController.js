const Newsletter = require('../models/Newsletter');
const { sendSuccess, sendError } = require('../utils/response');

// POST /newsletter/subscribe
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Step 1 — Check if email field is present
    if (!email) {
      return sendError(res, 'Email is required', 400);
    }

    // Step 2 — Validate email format using regex
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
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

    // Step 5 — Welcome email stub
    // TODO: Integrate with email service (Nodemailer / SendGrid)
    // For now we just log it — real email sending comes later
    console.log(`📧 Welcome email stub — would send to: ${email}`);
    console.log(`   Subject: Welcome to Threadline Newsletter!`);
    console.log(`   Body: Thank you for subscribing. Expect style updates soon.`);

    // Step 6 — Return success response
    sendSuccess(
      res,
      { email: subscriber.email, subscribedAt: subscriber.subscribedAt },
      'Successfully subscribed to Threadline newsletter',
      201
    );

  } catch (err) {
    sendError(res, err.message, 500);
  }
};