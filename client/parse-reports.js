const fs = require('fs');
const reports = ['report-home.json', 'report-landing.json', 'report-catalog.json', 'report-product.json'];
const results = reports.map(file => {
  if (!fs.existsSync(file)) return { file, error: 'missing' };
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const a11y = data.categories?.accessibility?.score * 100 || 'N/A';
    const fcp = data.audits?.['first-contentful-paint']?.numericValue || 'N/A';
    return { file, a11y: Math.round(a11y), fcp: Math.round(fcp) };
  } catch (e) {
    return { file, error: e.message };
  }
});
console.log(JSON.stringify(results, null, 2));
