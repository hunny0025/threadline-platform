// =============================================================
// Threadline Platform – k6 Product Search Load Test
// Usage: k6 run load-tests/search.js
// Simulates real users searching and browsing products
// =============================================================
/* eslint-disable */
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

// Custom metrics
const searchDuration = new Trend('search_duration');
const filterDuration = new Trend('filter_duration');
const productDetailDuration = new Trend('product_detail_duration');
const errorRate = new Rate('errors');
const searchCount = new Counter('total_searches');

export const options = {
  stages: [
    { duration: '20s', target: 3 },  // ramp up to 3 users
    { duration: '40s', target: 3 },  // hold at 3 users
    { duration: '10s', target: 0 },  // ramp down
  ],
  thresholds: {
    http_req_duration:      ['p(95)<1000'],
    http_req_failed:        ['rate<0.05'],
    search_duration:        ['p(95)<800'],
    filter_duration:        ['p(95)<800'],
    errors:                 ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Realistic search terms a fashion shopper would use
const SEARCH_TERMS = [
  'hoodie', 'jacket', 'jeans', 'shirt', 'tee',
  'slim', 'oversized', 'women', 'men', 'linen',
];

// Filter combinations simulating real user behaviour
const FILTERS = [
  { gender: 'women', fitType: 'slim' },
  { gender: 'men', fabricWeight: 'heavy' },
  { fitType: 'oversized', minPrice: 1000, maxPrice: 3000 },
  { gender: 'unisex', fabricWeight: 'light', maxPrice: 1500 },
  { fitType: 'slim', fabricWeight: 'medium', gender: 'men' },
];

export default function () {

  // Scenario 1 — Text search
  group('product search', () => {
    const term = SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)];
    const res = http.get(`${BASE_URL}/api/v1/search?q=${term}`, {
      tags: { name: 'search' },
      responseCallback: http.expectedStatuses(200),
    });

    const ok = check(res, {
      'search status 200': (r) => r.status === 200,
      'search returns results': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.success === true;
        } catch { return false; }
      },
    });

    searchDuration.add(res.timings.duration);
    searchCount.add(1);
    errorRate.add(!ok);
    sleep(1);
  });

  // Scenario 2 — Filter products (POST)
  group('product filter', () => {
    const filter = FILTERS[Math.floor(Math.random() * FILTERS.length)];
    const res = http.post(
      `${BASE_URL}/api/v1/products/filter`,
      JSON.stringify(filter),
      {
        headers: { 'Content-Type': 'application/json' },
        tags: { name: 'filter' },
        responseCallback: http.expectedStatuses(200),
      }
    );

    const ok = check(res, {
      'filter status 200': (r) => r.status === 200,
      'filter returns data': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.data !== undefined;
        } catch { return false; }
      },
    });

    filterDuration.add(res.timings.duration);
    errorRate.add(!ok);
    sleep(0.5);
  });

  // Scenario 3 — Browse product listing pages
  group('product listing', () => {
    const page = Math.floor(Math.random() * 3) + 1;
    const res = http.get(`${BASE_URL}/api/v1/products?page=${page}&limit=10`, {
      tags: { name: 'listing' },
      responseCallback: http.expectedStatuses(200),
    });

    const ok = check(res, {
      'listing status 200': (r) => r.status === 200,
      'listing has pagination': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.data.pagination !== undefined;
        } catch { return false; }
      },
    });

    errorRate.add(!ok);
    sleep(0.5);
  });

  sleep(Math.random() * 1 + 0.5); // think time between iterations
}