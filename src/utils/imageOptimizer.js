const path = require('path');

// Image optimizer placeholder
// Replace with sharp or jimp for real optimization
const optimizeImage = async (filePath, format = 'webp', maxWidth = 1000) => {
  // Return original path for now
  // In production, use sharp: await sharp(filePath).resize(maxWidth).toFormat(format).toFile(outputPath)
  return filePath;
};

module.exports = { optimizeImage };