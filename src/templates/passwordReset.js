const passwordResetTemplate = (user, resetLink) => {
  return {
    subject: `Reset your Threadline password`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">Password Reset Request</h2>
        <p>Hey ${user.name},</p>
        <p>We received a request to reset your Threadline account password. Click the button below to reset it.</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background: #1a1a1a; color: white; padding: 14px 28px; 
                    text-decoration: none; border-radius: 6px; font-size: 16px;">
            Reset Password
          </a>
        </div>

        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>⚠️ This link expires in 1 hour.</strong></p>
          <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        </div>

        <p style="color: #666; font-size: 12px;">© 2026 Threadline. All rights reserved.</p>
      </div>
    `,
  };
};

module.exports = passwordResetTemplate;