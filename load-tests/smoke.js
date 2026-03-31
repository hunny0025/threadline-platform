// =============================================================
// Threadline Platform — k6 Quick Smoke Test
// Usage: k6 run load-tests/smoke.js
// Fast sanity check: 1 VU × 10 iterations
// =============================================================
/* eslint-disable */
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  iterations: 10,
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Health check
  const health = http.get(`${BASE_URL}/health`);
  check(health, { 'health status 200': (r) => r.status === 200 });

  // Products list
  const products = http.get(`${BASE_URL}/api/v1/products`);
  check(products, { 'products status 200': (r) => r.status === 200 });

  sleep(0.5);
}
