# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: performance.spec.js >> Performance Testing (FCP) over 4G >> Measure FCP for Checkout
- Location: e2e\performance.spec.js:32:9

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://localhost:5173/checkout", waiting until "load"

```

```
Error: browserContext.close: Target page, context or browser has been closed
```