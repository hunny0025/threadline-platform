require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../db/mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const ProductVariant = require('../models/ProductVariant');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const StockReservation = require('../models/StockReservation');

const DRY_RUN = process.env.DRY_RUN !== 'false'; // default: dry run

const issues = [];
let fixedCount = 0;

function log(msg) { console.log(`  ${msg}`); }
function warn(msg) { issues.push(msg); console.warn(`  ⚠️  ${msg}`); }
function fixed(msg) { fixedCount++; console.log(`  🔧 FIXED: ${msg}`); }

// Check 1: Orphaned cart items
async function checkOrphanedCartItems() {
  console.log('\n📦 Check 1: Orphaned cart items...');
  const carts = await Cart.find({ 'items.0': { $exists: true } });
  let count = 0;

  for (const cart of carts) {
    const originalLen = cart.items.length;
    const valid = [];
    for (const item of cart.items) {
      const exists = await ProductVariant.exists({ _id: item.variant });
      if (exists) {
        valid.push(item);
      } else {
        warn(`Cart ${cart._id}: orphaned variant ${item.variant}`);
        count++;
      }
    }
    if (!DRY_RUN && valid.length !== originalLen) {
      cart.items = valid;
      await cart.save();
      fixed(`Removed ${originalLen - valid.length} orphaned items from cart ${cart._id}`);
    }
  }
  log(`Found ${count} orphaned cart items`);
}

//  Check 2: Negative stock on variants
async function checkNegativeStock() {
  console.log('\n📦 Check 2: Negative stock levels...');
  const bad = await ProductVariant.find({ stock: { $lt: 0 } });
  for (const v of bad) {
    warn(`Variant ${v._id} (SKU: ${v.sku}) has negative stock: ${v.stock}`);
    if (!DRY_RUN) {
      await ProductVariant.findByIdAndUpdate(v._id, { $set: { stock: 0 } });
      fixed(`Reset stock to 0 for variant ${v._id}`);
    }
  }
  log(`Found ${bad.length} variants with negative stock`);
}

// Check 3: Duplicate user emails 
async function checkDuplicateEmails() {
  console.log('\n👤 Check 3: Duplicate user emails...');
  const dupes = await User.aggregate([
    { $group: { _id: '$email', count: { $sum: 1 }, ids: { $push: '$_id' } } },
    { $match: { count: { $gt: 1 } } },
  ]);
  for (const { _id: email, count, ids } of dupes) {
    warn(`Duplicate email "${email}" found ${count} times. User IDs: ${ids.join(', ')}`);
    // Note: Cannot auto-fix duplicates — human decision required on which to keep
  }
  log(`Found ${dupes.length} duplicate email groups`);
}

// Check 4: Orphaned ProductVariants 
async function checkOrphanedVariants() {
  console.log('\n🏷️  Check 4: Orphaned ProductVariants (product deleted)...');
  const variants = await ProductVariant.find();
  let count = 0;
  for (const variant of variants) {
    const productExists = await Product.exists({ _id: variant.product });
    if (!productExists) {
      warn(`Variant ${variant._id} (SKU: ${variant.sku}) references missing product ${variant.product}`);
      count++;
      if (!DRY_RUN) {
        await ProductVariant.findByIdAndDelete(variant._id);
        fixed(`Deleted orphaned variant ${variant._id}`);
      }
    }
  }
  log(`Found ${count} orphaned variants`);
}

// Check 5: Orders with missing userId
async function checkOrdersWithoutUser() {
  console.log('\n📋 Check 5: Orders with missing userId...');
  const bad = await Order.find({ userId: { $exists: false } });
  for (const order of bad) {
    warn(`Order ${order._id} has no userId — data corruption`);
  }
  log(`Found ${bad.length} orders without userId`);
}

// Check 6: Reserved counts consistency 
async function checkReservedConsistency() {
  console.log('\n🔒 Check 6: Reserved count consistency...');
  const sums = await StockReservation.aggregate([
    { $group: { _id: '$variantId', totalReserved: { $sum: '$quantity' } } },
  ]);
  let count = 0;
  for (const { _id: variantId, totalReserved } of sums) {
    const variant = await ProductVariant.findById(variantId);
    if (!variant) continue;
    if (variant.reserved !== totalReserved) {
      warn(`Variant ${variantId}: reserved field=${variant.reserved}, actual sum=${totalReserved}`);
      count++;
      if (!DRY_RUN) {
        await ProductVariant.findByIdAndUpdate(variantId, { $set: { reserved: totalReserved } });
        fixed(`Corrected reserved count for variant ${variantId}`);
      }
    }
  }
  log(`Found ${count} reserved count mismatches`);
}

// Main
async function run() {
  await connectDB();
  console.log(`\n🔍 Threadline Data Integrity Validation`);
  console.log(`   Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'FIX MODE (changes will be saved)'}\n`);

  await checkOrphanedCartItems();
  await checkNegativeStock();
  await checkDuplicateEmails();
  await checkOrphanedVariants();
  await checkOrdersWithoutUser();
  await checkReservedConsistency();

  console.log('\n─────────────────────────────────────────');
  console.log(`Total issues found : ${issues.length}`);
  console.log(`Total fixes applied: ${fixedCount}`);

  if (issues.length > 0) {
    console.log('\nIssues:');
    issues.forEach((i, idx) => console.log(`  ${idx + 1}. ${i}`));
  } else {
    console.log('✅ No integrity issues found!');
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('Script failed:', err.message);
  process.exit(1);
});
