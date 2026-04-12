// ============================================================
// Threadline E2E — Performance Testing (FCP under 4G)
// Target: FCP <= 1.2s on key pages
// ============================================================

import { test, expect } from '@playwright/test';

// 4G Network profile (Fast 4G roughly)
// Download: 1.6 Mbps, Upload: 768 Kbps, Latency: 150ms
const NETWORK_THROTTLE = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (768 * 1024) / 8,
  latency: 150,
};

const PAGES_TO_TEST = [
  { name: 'Home', path: '/' },
  { name: 'Landing', path: '/landing' },
  { name: 'Catalog', path: '/catalog' },
  { name: 'Product Detail', path: '/product/test-product' },
  { name: 'Checkout', path: '/checkout' },
];

const FCP_THRESHOLD = 1200; // 1.2 seconds

test.describe('Performance Testing (FCP) over 4G', () => {
  // Store results outside so we can log them
  const results = [];

  for (const p of PAGES_TO_TEST) {
    test(`Measure FCP for ${p.name}`, async ({ page, context }) => {
      // Connect to CDP session to throttle network
      const client = await context.newCDPSession(page);
      await client.send('Network.enable');
      await client.send('Network.emulateNetworkConditions', NETWORK_THROTTLE);

      // We need to wait for load state so FCP has triggered
      await page.goto(p.path);
      await page.waitForLoadState('networkidle');

      // Get First Contentful Paint
      const fcpTime = await page.evaluate(() => {
        return new Promise((resolve) => {
          // If already fired, return it
          const paintMetrics = performance.getEntriesByName('first-contentful-paint');
          if (paintMetrics.length > 0) resolve(paintMetrics[0].startTime);

          // Otherwise, observe it
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            for (const entry of entries) {
              if (entry.name === 'first-contentful-paint') {
                observer.disconnect();
                resolve(entry.startTime);
              }
            }
          });
          observer.observe({ type: 'paint', buffered: true });
        });
      });

      console.log(`[Performance] ${p.name} FCP: ${fcpTime.toFixed(2)}ms`);
      
      results.push({
        name: p.name,
        fcp: fcpTime,
        status: fcpTime <= FCP_THRESHOLD ? 'PASS' : 'FAIL',
      });

      // Flag if exceeds threshold (will still record it)
      if (fcpTime > FCP_THRESHOLD) {
        test.info().annotations.push({ type: 'flag', description: `FCP exceeded 1.2s threshold. Was ${fcpTime.toFixed(2)}ms` });
      }

      // We don't fail the test strictly according to the task (just FLAG it), but we can assert it if we want.
      // The task says "Flag any page exceeding 1.2s", so we just push an annotation and log.
    });
  }

  test.afterAll(() => {
    console.log('\n=== FCP Performance Results (4G Throttled) ===');
    results.forEach((r) => {
      console.log(`${r.status === 'PASS' ? '✅' : '❌ FLAG'} ${r.name}: ${r.fcp.toFixed(2)}ms (Target <= ${FCP_THRESHOLD}ms)`);
    });
  });
});
