const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  filterProducts,
  getRecommendations,
} = require('../controllers/productController');
const upload = require('../middleware/upload');

router.get('/', getProducts);
router.get('/:id/recommendations', getRecommendations);
router.get('/:id', getProductById);
router.post('/filter', (req, res, next) => filterProducts(req, res, next));
router.post('/', auth, rbac('admin'), upload.array('images', 5), createProduct);
router.patch('/:id', auth, rbac('admin'), updateProduct);
router.delete('/:id', auth, rbac('admin'), deleteProduct);

// Variants
router.use('/:id/variants', require('./variants'));

module.exports = router;