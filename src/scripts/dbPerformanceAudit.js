require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../db/mongoose');

const Product = require('../models/Product');
const Order = require('../models/Order');
const AnalyticsEvent = require('../models/AnalyticsEvent');
const ProductVariant = require('../models/ProductVariant');
const Review = require('../models/Review');

const results = [];

function report(name, stats) {
  const stage = stats?.executionStages || stats?.queryPlanner?.winningPlan;
  const inputStage = stage?.inputStage;
  const scanType = inputStage?.stage || stage?.stage || 'UNKNOWN';
  const docsExamined = stats?.executionStats?.totalDocsExamined ?? '?';
  // eslint-disable-next-line no-unused-vars
  const docsReturned = stats?.executionStats?.totalKeysExamined ?? '?';
  const ms = stats?.executionStats?.executionTimeMillis ?? '?';

  const ok = !scanType.includes('COLLSCAN');
  const icon = ok ? '✅' : '❌ COLLSCAN';

  const entry = { name, scanType, docsExamined, ms, ok };
  results.push(entry);
  console.log(`${icon} [${ms}ms] ${name} → ${scanType} (docs examined: ${docsExamined})`);
}

async function audit() {
  await connectDB();
  console.log('\n🔍 Threadline DB Performance Audit\n');

  // Get a real sample ID for queries
  const sampleProduct = await Product.findOne({ isActive: true }).select('_id category');
  const sampleOrder   = await Order.findOne().select('_id userId');
  const sampleReview  = await Review.findOne().select('_id productId');

  // ── 1. Product filter query (PLP most common) ──────────────
  try {
    const ex = await Product.find({ isActive: true })
      .sort({ basePrice: 1 })
      .explain('executionStats');
    report('Product list (isActive + sort by price)', ex);
  } catch (e) { console.error('Query 1 failed:', e.message); }

  // ── 2. Product filter by category ──────────────────────────
  if (sampleProduct) {
    try {
      const ex = await Product.find({
        category: sampleProduct.category,
        isActive: true,
      }).sort({ basePrice: 1 }).explain('executionStats');
      report('Product filter by category + price sort', ex);
    } catch (e) { console.error('Query 2 failed:', e.message); }
  }

  // ── 3. Full hyper-filter ───────────────────────────────────
  try {
    const ex = await Product.find({
      fitType: 'slim',
      fabricWeight: 'medium',
      gender: 'men',
      isActive: true,
    }).explain('executionStats');
    report('Product hyper-filter (fitType+fabricWeight+gender)', ex);
  } catch (e) { console.error('Query 3 failed:', e.message); }

  // ── 4. Text search ─────────────────────────────────────────
  try {
    const ex = await Product.find({ $text: { $search: 'cotton tee' } })
      .explain('executionStats');
    report('Product text search', ex);
  } catch (e) { console.error('Query 4 failed:', e.message); }

  // ── 5. Order history by user ───────────────────────────────
  if (sampleOrder) {
    try {
      const ex = await Order.find({ userId: sampleOrder.userId })
        .sort({ createdAt: -1 })
        .explain('executionStats');
      report('Order history by userId + sort date', ex);
    } catch (e) { console.error('Query 5 failed:', e.message); }
  }

  // ── 6. Analytics event query ───────────────────────────────
  try {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const ex = await AnalyticsEvent.find({
      eventType: 'cart_add',
      createdAt: { $gte: since },
    }).explain('executionStats');
    report('Analytics: cart_add events last 30 days', ex);
  } catch (e) { console.error('Query 6 failed:', e.message); }

  // ── 7. Variant stock check ─────────────────────────────────
  if (sampleProduct) {
    try {
      const ex = await ProductVariant.find({
        product: sampleProduct._id,
      }).explain('executionStats');
      report('ProductVariant by product ID', ex);
    } catch (e) { console.error('Query 7 failed:', e.message); }
  }

  // ── 8. Review fetch by product ─────────────────────────────
  if (sampleReview) {
    try {
      const ex = await Review.find({
        productId: sampleReview.productId,
      }).sort({ createdAt: -1 }).explain('executionStats');
      report('Reviews by productId', ex);
    } catch (e) { console.error('Query 8 failed:', e.message); }
  }

  // ── Summary ────────────────────────────────────────────────
  console.log('\n─────────────────────────────────────────');
  const passed  = results.filter((r) => r.ok).length;
  const failed  = results.filter((r) => !r.ok).length;
  console.log(`✅ Using index : ${passed}/${results.length}`);
  console.log(`❌ COLLSCAN    : ${failed}/${results.length}`);

  if (failed > 0) {
    console.log('\nQueries needing indexes:');
    results.filter((r) => !r.ok).forEach((r) => {
      console.log(`  → ${r.name}`);
    });
    console.log('\nAdd these to your model files as .index() calls,');
    console.log('then re-run this audit to confirm COLLSCAN is resolved.');
  } else {
    console.log('\n🎉 All critical queries are using indexes!');
  }

  await mongoose.disconnect();
  process.exit(0);
}

audit().catch((err) => {
  console.error('Audit failed:', err.message);
  process.exit(1);
});
