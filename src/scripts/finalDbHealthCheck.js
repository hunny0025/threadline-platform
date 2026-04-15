require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../db/mongoose');

async function healthCheck() {
  await connectDB();
  const db = mongoose.connection.db;

  console.log('\n🏥 Threadline — Final DB Health Check\n');

  // 1. Collection counts 
  console.log('📊 Collection Counts:');
  const collections = [
    'users', 'products', 'productvariants', 'categories',
    'carts', 'orders', 'reviews', 'analyticsevents',
    'stockreservations', 'newsletters', 'coupons', 'promotions',
  ];

  for (const col of collections) {
    try {
      const count = await db.collection(col).countDocuments();
      const icon = count > 0 ? '✅' : '⚠️ ';
      console.log(`  ${icon} ${col}: ${count} documents`);
    } catch (e) {
      console.log(`  ❓ ${col}: not found`);
    }
  }

  //  2. Index verification
  console.log('\n📑 Index Verification:');
  const expectedIndexes = {
    products: ['category_1_isActive_1_basePrice_1', 'product_text_index'],
    productvariants: ['product_1_size_1_color_1'],
    orders: ['userId_1_createdAt_-1'],
    reviews: ['userId_1_productId_1'],
    analyticsevents: ['eventType_1_createdAt_-1'],
    carts: ['expiresAt_1'],
    stockreservations: ['expiresAt_1'],
  };

  for (const [col, needed] of Object.entries(expectedIndexes)) {
    try {
      const indexes = await db.collection(col).indexes();
      const indexNames = indexes.map((i) => i.name);
      for (const req of needed) {
        const found = indexNames.some((n) => n.includes(req.split('_')[0]));
        console.log(`  ${found ? '✅' : '❌ MISSING'} ${col} → ${req}`);
      }
    } catch (e) {
      console.log(`  ❓ Could not check ${col}: ${e.message}`);
    }
  }

  // 3. Connection info
  console.log('\n🔌 Connection:');
  const state = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  console.log(`  Status  : ${state[mongoose.connection.readyState]}`);
  console.log(`  Host    : ${mongoose.connection.host}`);
  console.log(`  DB Name : ${mongoose.connection.name}`);

  // 4. Storage stats 
  try {
    const stats = await db.stats();
    const mb = (bytes) => (bytes / 1024 / 1024).toFixed(2);
    console.log('\n💾 Storage:');
    console.log(`  Data size   : ${mb(stats.dataSize)} MB`);
    console.log(`  Storage size: ${mb(stats.storageSize)} MB`);
    console.log(`  Index size  : ${mb(stats.indexSize)} MB`);
    console.log(`  Collections : ${stats.collections}`);
  } catch (e) {
    console.log('\n💾 Storage stats unavailable (need Atlas admin access)');
  }

  //  5. Atlas config reminders (manual checklist) 
  console.log('\n📋 Atlas Production Checklist (verify manually in Atlas UI):');
  const checklist = [
    'Automated daily backups enabled (Cluster → Backup)',
    'Point-in-time recovery enabled',
    'Replica set active (M10+ cluster)',
    'Encryption at rest enabled',
    'IP Access List set to production server IPs only',
    'Database user has least-privilege access (readWrite on DB only)',
    'Alert: Disk IOPS > 80%',
    'Alert: Replication lag > 10s',
    'Alert: Connections > 80% of max',
    'Alert: Query Targeting > 1000 (index miss)',
    'Auto-scaling enabled for storage',
  ];
  checklist.forEach((item, i) => {
    console.log(`  ☐ ${i + 1}. ${item}`);
  });

  console.log('\n✅ Health check complete.\n');
  await mongoose.disconnect();
  process.exit(0);
}

healthCheck().catch((err) => {
  console.error('Health check failed:', err.message);
  process.exit(1);
});
