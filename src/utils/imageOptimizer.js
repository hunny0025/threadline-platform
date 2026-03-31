// Image optimizer placeholder
// Replace with sharp or jimp for real optimization
const optimizeImage = async (filePath) => {
  // Return original path for now
  // In production: await sharp(filePath).resize(maxWidth).toFormat(format).toFile(outputPath)
  return filePath;
};

module.exports = { optimizeImage };