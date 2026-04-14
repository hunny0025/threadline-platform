/**
 * Welcome Newsletter Email Template
 * Sent when a new user subscribes to the Threadline newsletter.
 */
module.exports = (email) => ({
  subject: '🧵 Welcome to Threadline — Style, Curated for You',
  html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #fafaf9; border-radius: 12px; overflow: hidden;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #18181b 0%, #3f3f46 100%); padding: 40px 32px; text-align: center;">
        <h1 style="color: #fff; font-size: 28px; margin: 0 0 8px 0; letter-spacing: 2px;">THREADLINE</h1>
        <p style="color: #a1a1aa; font-size: 14px; margin: 0; letter-spacing: 1px;">CURATED FASHION</p>
      </div>

      <!-- Body -->
      <div style="padding: 40px 32px;">
        <h2 style="color: #18181b; font-size: 22px; margin: 0 0 16px 0;">Welcome to the Thread.</h2>
        <p style="color: #52525b; font-size: 15px; line-height: 1.7; margin: 0 0 20px 0;">
          You've just joined a community of people who care about what they wear — and why it matters.
          From low-volume capsule drops to exclusive early access, you'll always hear it here first.
        </p>

        <div style="background: #fff; border: 1px solid #e4e4e7; border-radius: 8px; padding: 24px; margin: 24px 0;">
          <h3 style="color: #18181b; font-size: 16px; margin: 0 0 12px 0;">What to expect:</h3>
          <ul style="color: #52525b; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px;">
            <li>🔔 Priority access to new drops</li>
            <li>🎨 Behind-the-scenes design stories</li>
            <li>💡 Style guides &amp; seasonal lookbooks</li>
            <li>🎁 Subscriber-only offers</li>
          </ul>
        </div>

        <p style="color: #71717a; font-size: 13px; line-height: 1.6; margin: 24px 0 0 0;">
          This email was sent to <strong>${email}</strong> because you subscribed to the Threadline newsletter.
          If this wasn't you, simply ignore this email.
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f4f4f5; padding: 24px 32px; text-align: center; border-top: 1px solid #e4e4e7;">
        <p style="color: #a1a1aa; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} Threadline. Crafted with intention.
        </p>
      </div>
    </div>
  `,
});
