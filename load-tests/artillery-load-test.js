// =============================================================
// Threadline Platform — Load Test (Artillery-compatible)
// Measures: p50/p95/p99 latency, error rates, RPS, throughput
// Usage: node load-tests/artillery-load-test.js
//        BASE_URL=http://localhost:3000 DURATION=60 VUS=50 node load-tests/artillery-load-test.js
// =============================================================
'use strict';

const http = require('http');
const https = require('https');
const { URL } = require('url');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const DURATION_SEC = parseInt(process.env.DURATION || '45', 10);
const VUS = parseInt(process.env.VUS || '20', 10);
const RAMP_UP_SEC = parseInt(process.env.RAMP_UP || '10', 10);
const WARMUP_REQS = parseInt(process.env.WARMUP || '3', 10);

// ── Test endpoints ────────────────────────────────────────────────────────────
const ENDPOINTS = [
  { name: 'products_list',    path: '/api/v1/products',                                  weight: 4 },
  { name: 'products_filter',  path: '/api/v1/products/filter',                          weight: 2, method: 'POST', body: JSON.stringify({ gender: 'unisex', limit: 20 }) },
  { name: 'product_detail',   path: '/api/v1/products/69cc1a6f81da59a735394591',       weight: 1 },
  { name: 'search_shirt',     path: '/api/v1/search?q=shirt',                           weight: 2 },
  { name: 'search_jeans',     path: '/api/v1/search?q=jeans',                           weight: 1 },
  { name: 'categories',       path: '/api/v1/categories',                               weight: 1 },
];

// ── Weighted random endpoint picker ──────────────────────────────────────────
const totalWeight = ENDPOINTS.reduce((s, e) => s + e.weight, 0);
function pickEndpoint() {
  let r = Math.random() * totalWeight;
  for (const e of ENDPOINTS) {
    r -= e.weight;
    if (r <= 0) return e;
  }
  return ENDPOINTS[0];
}

// ── HTTP request helper ───────────────────────────────────────────────────────
function makeRequest(ep) {
  return new Promise((resolve) => {
    const urlObj = new URL(BASE_URL + ep.path);
    const mod = urlObj.protocol === 'https:' ? https : http;
    const start = process.hrtime.bigint();

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: ep.method || 'GET',
      headers: {
        'User-Agent': 'Artillery/LoadTest',
        'Content-Type': 'application/json',
      },
    };

    const req = mod.request(options, (res) => {
      res.on('data', () => {});
      res.on('end', () => {
        const latencyNs = Number(process.hrtime.bigint() - start);
        resolve({ status: res.statusCode, latencyNs, ok: res.statusCode < 400, statusCode: res.statusCode });
      });
    });

    req.on('error', (err) => {
      const latencyNs = Number(process.hrtime.bigint() - start);
      resolve({ status: 0, latencyNs, ok: false, error: err.message, statusCode: 0 });
    });

    req.setTimeout(30_000, () => {
      req.destroy();
      resolve({ status: 0, latencyNs: Number(process.hrtime.bigint() - start), ok: false, error: 'timeout', statusCode: 0 });
    });

    if (ep.body) req.write(ep.body);
    req.end();
  });
}

// ── Percentile helper ──────────────────────────────────────────────────────────
function percentile(arr, p) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return Math.round(sorted[Math.max(0, idx)]);
}
function avg(arr) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}

// ── Single virtual user loop ──────────────────────────────────────────────────
async function vuLoop(id, resultSink, warmupDone) {
  for (let i = 0; i < WARMUP_REQS; i++) {
    await makeRequest(pickEndpoint());
  }

  while (!warmupDone.load && !global.__testDone) {
    const ep = pickEndpoint();
    const { latencyNs, ok, statusCode } = await makeRequest(ep);
    if (warmupDone.load) {
      resultSink.push({ name: ep.name, latencyMs: latencyNs / 1e6, ok, statusCode });
    }
  }

  while (!global.__testDone) {
    const ep = pickEndpoint();
    const { latencyNs, ok, statusCode } = await makeRequest(ep);
    resultSink.push({ name: ep.name, latencyMs: latencyNs / 1e6, ok, statusCode });
    await new Promise(r => setTimeout(r, 100 + Math.random() * 400));
  }
}

// ── Banner ─────────────────────────────────────────────────────────────────────
function printBanner() {
  console.log('\n' + '='.repeat(70));
  console.log('  Threadline Platform — Load Test');
  console.log('  Target   :', BASE_URL);
  console.log('  VUs      :', VUS);
  console.log('  Duration :', DURATION_SEC, 's');
  console.log('  Ramp-up  :', RAMP_UP_SEC, 's');
  console.log('='.repeat(70) + '\n');
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  printBanner();

  console.log('[setup] Checking server reachability...');
  try {
    const urlObj = new URL(BASE_URL + '/health');
    const mod = urlObj.protocol === 'https:' ? https : http;
    await new Promise((res, rej) => {
      const req = mod.get(urlObj, (r) => { r.on('data', () => {}); r.on('end', res); });
      req.on('error', rej);
      req.setTimeout(5000, () => { req.destroy(); rej(new Error('timeout')); });
    });
    console.log('[setup] Server is reachable.\n');
  } catch (_) {
    console.warn('[setup] Warning: server /health check failed.\n');
  }

  const warmupDone = { load: false };
  const allResults = [];

  console.log(`[test] Starting ramp-up (${RAMP_UP_SEC}s) to ${VUS} VUs...\n`);

  const startTime = Date.now();

  for (let i = 0; i < VUS; i++) {
    if (global.__testDone) break;
    const sink = [];
    allResults.push(sink);
    vuLoop(i + 1, sink, warmupDone);
    await new Promise(r => setTimeout(r, (RAMP_UP_SEC * 1000) / VUS));
  }

  await new Promise(r => setTimeout(r, RAMP_UP_SEC * 1000 + 500));
  warmupDone.load = true;
  console.log(`[test] Ramp-up complete — ${VUS} VUs active, measuring...\n`);

  await new Promise(r => setTimeout(r, DURATION_SEC * 1000));
  global.__testDone = true;

  await new Promise(r => setTimeout(r, 2000));

  const elapsedSec = (Date.now() - startTime) / 1000;

  const flat = allResults.flat();
  const successLatencies = flat.filter(r => r.ok).map(r => r.latencyMs);
  const errorCount = flat.filter(r => !r.ok).length;
  const totalRequests = flat.length;
  const errorRate = (errorCount / totalRequests * 100).toFixed(2);
  const rps = (totalRequests / elapsedSec).toFixed(1);

  const byEndpoint = {};
  for (const ep of ENDPOINTS) byEndpoint[ep.name] = { latencies: [], errors: 0, count: 0, statuses: {} };
  for (const r of flat) {
    const bucket = byEndpoint[r.name];
    if (!bucket) continue;
    bucket.latencies.push(r.latencyMs);
    if (!r.ok) bucket.errors++;
    bucket.count++;
    bucket.statuses[r.statusCode] = (bucket.statuses[r.statusCode] || 0) + 1;
  }

  console.log('\n' + '='.repeat(70));
  console.log('  RESULTS');
  console.log('='.repeat(70));
  console.log(`  Total requests  : ${totalRequests.toLocaleString()}`);
  console.log(`  Successful      : ${(totalRequests - errorCount).toLocaleString()}`);
  console.log(`  Failed          : ${errorCount.toLocaleString()} (${errorRate}%)`);
  console.log(`  Test duration   : ${elapsedSec.toFixed(1)}s`);
  console.log(`  Throughput      : ${rps} req/s\n`);

  if (successLatencies.length > 0) {
    console.log('  Overall Latency (successful requests)');
    console.log(`    avg   : ${avg(successLatencies).toFixed(1)} ms`);
    console.log(`    p(50) : ${percentile(successLatencies, 50).toFixed(1)} ms`);
    console.log(`    p(95) : ${percentile(successLatencies, 95).toFixed(1)} ms`);
    console.log(`    p(99) : ${percentile(successLatencies, 99).toFixed(1)} ms`);
    console.log(`    max   : ${Math.max(...successLatencies).toFixed(1)} ms\n`);
  }

  console.log('  Per-Endpoint Breakdown (sorted by p95 desc)');
  console.log('  ' + '-'.repeat(70));

  const epRows = Object.entries(byEndpoint)
    .filter(([, b]) => b.count > 0)
    .map(([name, b]) => ({
      name,
      count: b.count,
      errors: b.errors,
      errorRate: (b.errors / b.count * 100).toFixed(1),
      avg: avg(b.latencies),
      p50: percentile(b.latencies, 50),
      p95: percentile(b.latencies, 95),
      p99: percentile(b.latencies, 99),
      max: Math.max(...b.latencies),
      statuses: b.statuses,
    }))
    .sort((a, b) => b.p95 - a.p95);

  const CL = 18;
  console.log(`  %-(${CL})+s %6s %5s %7s %7s %7s %7s %7s  %s`, 'Endpoint', 'Count', 'Err%', 'Avg', 'p(50)', 'p(95)', 'p(99)', 'Max', 'Verdict');
  console.log('  ' + '-'.repeat(70));

  for (const row of epRows) {
    const errPct = parseFloat(row.errorRate);
    let verdict = 'OK';
    if (row.p95 > 2000 || errPct > 5) verdict = 'SLOW';
    if (row.p95 > 5000 || errPct > 20) verdict = 'CRIT';
    if (row.errors === row.count && row.count > 0) verdict = 'DOWN';
    const statusStr = Object.entries(row.statuses)
      .sort((a, b) => b[1] - a[1])
      .map(([s, c]) => `${s}:${c}`)
      .join(' ');
    console.log(
      `  %-(${CL})+s %6d %5s %7d %7d %7d %7d %7d  %s  [${statusStr}]`,
      row.name.substring(0, CL), row.count,
      row.errors > 0 ? row.errorRate + '%' : '0%',
      Math.round(row.avg), Math.round(row.p50), Math.round(row.p95), Math.round(row.p99), Math.round(row.max),
      verdict
    );
  }

  console.log('\n  SLOW = p95>2s or err>5%   CRIT = p95>5s or err>20%   DOWN = all failed\n');

  console.log('='.repeat(70));
  console.log('  BOTTLENECK ANALYSIS');
  console.log('='.repeat(70));
  const slowEps = epRows.filter(r => r.p95 > 1000);
  if (slowEps.length > 0) {
    console.log('  Endpoints with p95 > 1000ms:');
    for (const ep of slowEps) {
      console.log(`    • ${ep.name}: p95=${Math.round(ep.p95)}ms  (avg=${Math.round(ep.avg)}ms, err=${ep.errorRate}%)`);
    }
    console.log('\n  Probable root causes:');
    console.log('    1. Redis is DOWN — no cache hits, every request hits MongoDB directly');
    console.log('       → Start Redis: redis-server or check REDIS_URL env var');
    console.log('    2. MongoDB collection scans — no compound index on (isActive, category, gender)');
    console.log('       → Add: db.products.createIndex({ isActive:1, category:1, gender:1 })');
    console.log('    3. $text search on large collection without text index');
    console.log('       → Add: db.products.createIndex({ name:\'text\', description:\'text\' })');
    console.log('    4. N+1 populate() in getProducts — each doc triggers separate lookups');
    console.log('       → Use aggregation pipeline instead of .populate() for lists\n');
  } else {
    console.log('  All endpoints within acceptable p95 (< 1000ms). No bottlenecks detected.\n');
  }

  if (parseFloat(errorRate) > 5) {
    console.log(`  Elevated error rate (${errorRate}%). Check:`);
    console.log('    - 500 errors: exceptions in controller code');
    console.log('    - Connection pool saturation: MongoDB maxPoolSize exhausted');
    console.log('    - Memory/CPU saturation under load\n');
  }

  console.log('='.repeat(70) + '\n');
}

main().catch(console.error);
