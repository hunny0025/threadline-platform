// ============================================================
// Threadline Platform — Lighthouse CI Configuration
// Enforces performance budgets: FCP <1.2s, LCP <2.5s, CLS <0.1
// Usage: npx @lhci/cli autorun
// ============================================================
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:5173/',
        'http://localhost:5173/catalog',
        'http://localhost:5173/landing',
        'http://localhost:5173/about',
      ],
      startServerCommand: 'cd client && npm run preview',
      startServerReadyPattern: 'Local',
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        chromeFlags: '--no-sandbox --headless',
      },
    },
    assert: {
      assertions: {
        // Performance budgets
        'first-contentful-paint': ['error', { maxNumericValue: 1200 }],  // <1.2s
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }], // <2.5s
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }],

        // Category scores (0-1)
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
