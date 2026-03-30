// =============================================================
// Threadline Platform — k6 Load Test
// Usage: k6 run --env BASE_URL=https://staging.railway.app load-tests/load.js
// Ramps to 100 VUs over 1 min, holds 3 min, ramps down 1 min
// =============================================================
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const errorRate = new Rate('errors');
const productDuration = new Trend('product_list_duration');

export const options = {
  stages: [
    { duration: '1m', target: 100 },  // ramp up to 100 VUs
    { duration: '3m', target: 100 },  // hold at 100 VUs
    { duration: '1m', target: 0 },    // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],   // 95% of requests under 1s
    http_req_failed: ['rate<0.05'],      // less than 5% failure rate
    errors: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

const ENDPOINTS = [
  { name: 'health',     url: '/health',               expectedStatus: 200 },
  { name: 'products',   url: '/api/v1/products',      expectedStatus: 200 },
  { name: 'categories', url: '/api/v1/categories',    expectedStatus: 200 },
  { name: 'search',     url: '/api/v1/search?q=shirt',expectedStatus: 200 },
];

export default function () {
  // Pick an endpoint randomly to simulate mixed traffic
  const endpoint = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];

  const res = http.get(`${BASE_URL}${endpoint.url}`, {
    tags: { endpoint: endpoint.name },
  });

  const ok = check(res, {
    [`${endpoint.name} status ${endpoint.expectedStatus}`]: (r) =>
      r.status === endpoint.expectedStatus,
  });

  errorRate.add(!ok);

  if (endpoint.name === 'products') {
    productDuration.add(res.timings.duration);
  }

  sleep(Math.random() * 1 + 0.5); // random think time 0.5–1.5s
}
