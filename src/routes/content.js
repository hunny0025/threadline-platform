const express = require('express');
const router = express.Router();
const { getContent, updateContent } = require('../controllers/contentController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

// GET /api/v1/content/:slug — public
router.get('/:slug', getContent);

// PATCH /api/v1/content/:slug — admin only
router.patch('/:slug', auth, rbac('admin'), updateContent);

module.exports = router;