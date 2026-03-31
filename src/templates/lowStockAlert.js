const lowStockAlertTemplate = (product, variant, stock) => {
  return {
    subject: `⚠️ Low Stock Alert: ${product.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d32f2f;">Low Stock Alert! ⚠️</h2>
        <p>The following product is running low on stock and needs immediate attention.</p>

        <div style="background: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Product Details</h3>
          <p><strong>Product:</strong> ${product.name}</p>
          <p><strong>SKU:</strong> ${variant.sku || 'N/A'}</p>
          <p><strong>Size:</strong> ${variant.size}</p>
          <p><strong>Color:</strong> ${variant.color}</p>
          <p><strong>Current Stock:</strong> 
            <span style="color: #d32f2f; font-weight: bold;">${stock} units remaining</span>
          </p>
        </div>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
          <h3>Action Required</h3>
          <p>Please restock this item as soon as possible to avoid stockouts.</p>
        </div>

        <p style="color: #666; font-size: 12px;">© 2026 Threadline Admin. All rights reserved.</p>
      </div>
    `,
  };
};

module.exports = lowStockAlertTemplate;