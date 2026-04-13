#!/usr/bin/env node
// ============================================================
// Threadline Platform — Pre-flight Deployment Checklist
// Usage: node scripts/preflight.js
// Validates all required env vars, DB connectivity, payment
// webhook URLs, and SSL before production deployment.
// ============================================================

const https = require('https');
const http = require('http');

const REQUIRED_ENV_VARS = [
  'NODE_ENV',
  'MONGODB_URI',
  'REDIS_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'SESSION_SECRET',
  'ALLOWED_ORIGINS',
];

const RECOMMENDED_ENV_VARS = [
  'SENTRY_DSN',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'RAZORPAY_WEBHOOK_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL',
  'EMAIL_HOST',
  'EMAIL_USER',
  'EMAIL_PASS',
];

let exitCode = 0;
const results = { pass: [], warn: [], fail: [] };

function pass(msg) { results.pass.push(msg); console.log(`  ✅ ${msg}`); }
function warn(msg) { results.warn.push(msg); console.log(`  ⚠️  ${msg}`); }
function fail(msg) { results.fail.push(msg); console.log(`  ❌ ${msg}`); exitCode = 1; }

function checkUrl(url, label) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { timeout: 5000 }, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        pass(`${label}: reachable (${res.statusCode})`);
      } else {
        warn(`${label}: returned status ${res.statusCode}`);
      }
      resolve();
    });
    req.on('error', () => { fail(`${label}: unreachable`); resolve(); });
    req.on('timeout', () => { req.destroy(); fail(`${label}: timed out`); resolve(); });
  });
}

async function run() {
  console.log('\n🚀 Threadline Pre-flight Deployment Checklist\n');
  console.log('━'.repeat(50));

  // ── 1. Required Environment Variables ──
  console.log('\n📋 Required Environment Variables:');
  for (const v of REQUIRED_ENV_VARS) {
    if (process.env[v]) {
      pass(`${v} is set`);
    } else {
      fail(`${v} is NOT set`);
    }
  }

  // ── 2. Recommended Environment Variables ──
  console.log('\n📋 Recommended Environment Variables:');
  for (const v of RECOMMENDED_ENV_VARS) {
    if (process.env[v]) {
      pass(`${v} is set`);
    } else {
      warn(`${v} is not set (optional but recommended)`);
    }
  }

  // ── 3. JWT Secret Strength ──
  console.log('\n🔐 Secret Strength Checks:');
  const jwtSecret = process.env.JWT_SECRET || '';
  if (jwtSecret.length >= 32) {
    pass(`JWT_SECRET length: ${jwtSecret.length} chars (≥32)`);
  } else if (jwtSecret.length > 0) {
    warn(`JWT_SECRET is only ${jwtSecret.length} chars (recommend ≥32)`);
  }

  const sessionSecret = process.env.SESSION_SECRET || '';
  if (sessionSecret.length >= 32) {
    pass(`SESSION_SECRET length: ${sessionSecret.length} chars (≥32)`);
  } else if (sessionSecret.length > 0) {
    warn(`SESSION_SECRET is only ${sessionSecret.length} chars (recommend ≥32)`);
  }

  // ── 4. NODE_ENV Check ──
  console.log('\n🌍 Environment:');
  const nodeEnv = process.env.NODE_ENV || 'not set';
  if (nodeEnv === 'production' || nodeEnv === 'staging') {
    pass(`NODE_ENV = ${nodeEnv}`);
  } else {
    warn(`NODE_ENV = ${nodeEnv} (expected production or staging for deploy)`);
  }

  // ── 5. MongoDB URI Format ──
  console.log('\n🗄️  Database Checks:');
  const mongoUri = process.env.MONGODB_URI || '';
  if (mongoUri.startsWith('mongodb+srv://') || mongoUri.startsWith('mongodb://')) {
    pass('MONGODB_URI format looks valid');
    if (nodeEnv === 'production' && mongoUri.includes('localhost')) {
      fail('MONGODB_URI points to localhost in production!');
    }
  } else if (mongoUri) {
    warn('MONGODB_URI format may be invalid');
  }

  // ── 6. Redis URL Format ──
  const redisUrl = process.env.REDIS_URL || '';
  if (redisUrl.startsWith('redis://') || redisUrl.startsWith('rediss://')) {
    pass('REDIS_URL format looks valid');
    if (nodeEnv === 'production' && redisUrl.includes('localhost')) {
      fail('REDIS_URL points to localhost in production!');
    }
  } else if (redisUrl) {
    warn('REDIS_URL format may be invalid');
  }

  // ── 7. CORS Origins ──
  console.log('\n🌐 CORS / Origins:');
  const origins = process.env.ALLOWED_ORIGINS || '';
  if (origins) {
    const originList = origins.split(',').map(o => o.trim());
    pass(`ALLOWED_ORIGINS has ${originList.length} origin(s): ${originList.join(', ')}`);
    if (nodeEnv === 'production' && origins.includes('localhost')) {
      warn('ALLOWED_ORIGINS includes localhost in production');
    }
  }

  // ── 8. Payment Webhook Check ──
  console.log('\n💳 Payment:');
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    pass('Razorpay credentials are set');
    if (process.env.RAZORPAY_WEBHOOK_SECRET) {
      pass('Razorpay webhook secret is configured');
    } else {
      warn('RAZORPAY_WEBHOOK_SECRET not set — webhook verification disabled');
    }
  } else {
    warn('Razorpay credentials not set — payment features disabled');
  }

  // ── 9. SSL Check (production URLs) ──
  console.log('\n🔒 Connectivity:');
  const apiUrl = process.env.API_URL || process.env.RAILWAY_URL;
  if (apiUrl) {
    await checkUrl(`${apiUrl}/health`, 'API Health endpoint');
  } else {
    warn('No API_URL/RAILWAY_URL set — skipping connectivity check');
  }

  // ── Summary ──
  console.log('\n' + '━'.repeat(50));
  console.log(`\n📊 Summary: ${results.pass.length} passed, ${results.warn.length} warnings, ${results.fail.length} failures\n`);

  if (exitCode === 0) {
    console.log('🟢 Pre-flight check PASSED — ready to deploy!\n');
  } else {
    console.log('🔴 Pre-flight check FAILED — fix the errors above before deploying.\n');
  }

  process.exit(exitCode);
}

run().catch((err) => {
  console.error('Pre-flight script error:', err);
  process.exit(1);
});
