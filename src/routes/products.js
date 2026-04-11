const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
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
const { validate } = require('../middleware/validation');
const upload = require('../middleware/upload');

// Query validation
const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
];

const productIdValidation = [
  param('id').isMongoId().withMessage('Valid product ID required'),
];

const createProductValidation = [
  body('name').trim().isLength({ min: 2, max: 200 }).withMessage('Name must be 2-200 characters'),
  body('slug').trim().isLength({ min: 2, max: 200 }).withMessage('Slug must be 2-200 characters'),
  body('basePrice').isFloat({ min: 0 }).withMessage('Price must be positive number'),
  body('category').isMongoId().withMessage('Valid category ID required'),
];

router.get('/', paginationValidation, validate, getProducts);
router.get('/:id/recommendations', productIdValidation, validate, getRecommendations);
router.get('/:id', productIdValidation, validate, getProductById);
router.post('/filter', filterProducts);
router.post('/', auth, rbac('admin'), upload.array('images', 5), createProductValidation, validate, createProduct);
router.patch('/:id', auth, rbac('admin'), productIdValidation, validate, updateProduct);
router.delete('/:id', auth, rbac('admin'), productIdValidation, validate, deleteProduct);

// Variants
router.use('/:id/variants', require('./variants'));
const { createReview, getReviews } = require('../controllers/reviewController');
// Reviews
router.get('/:productId/reviews', getReviews);
router.post('/:productId/reviews', auth, upload.single('image'), createReview);
module.exports = router;
