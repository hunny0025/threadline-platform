const orderConfirmationTemplate = (order, user) => {
  return {
    subject: `Order Confirmed! #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">Hey ${user.name}, your order is confirmed! 🎉</h2>
        <p>Thank you for shopping with Threadline. Your order has been placed successfully.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> #${order._id}</p>
          <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
          <p><strong>Status:</strong> ${order.statusHistory[order.statusHistory.length - 1]?.status}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #1a1a1a; color: white;">
              <th style="padding: 10px;">Item</th>
              <th style="padding: 10px;">Qty</th>
              <th style="padding: 10px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px;">${item.name || 'Product'} (${item.size}, ${item.color})</td>
                <td style="padding: 10px; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; text-align: right;">₹${item.price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <p style="margin-top: 20px;">We'll notify you when your order ships!</p>
        <p style="color: #666; font-size: 12px;">© 2026 Threadline. All rights reserved.</p>
      </div>
    `,
  };
};

module.exports = orderConfirmationTemplate;