const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', auth, rbac('admin'), createCategory);
router.patch('/:id', auth, rbac('admin'), updateCategory);
router.delete('/:id', auth, rbac('admin'), deleteCategory);

module.exports = router;