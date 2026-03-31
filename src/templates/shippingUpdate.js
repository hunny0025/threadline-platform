const shippingUpdateTemplate = (order, user, trackingNumber) => {
  return {
    subject: `Your order #${order._id} has shipped! 🚚`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">Great news ${user.name}, your order is on its way!</h2>
        <p>Your Threadline order has been shipped and is heading your way.</p>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Shipping Details</h3>
          <p><strong>Order ID:</strong> #${order._id}</p>
          <p><strong>Tracking Number:</strong> ${trackingNumber || 'Will be updated soon'}</p>
          <p><strong>Status:</strong> Shipped</p>
        </div>

        <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Estimated Delivery</h3>
          <p>Your order is expected to arrive within 3-5 business days.</p>
        </div>

        <p>Thank you for shopping with Threadline!</p>
        <p style="color: #666; font-size: 12px;">© 2026 Threadline. All rights reserved.</p>
      </div>
    `,
  };
};

module.exports = shippingUpdateTemplate;