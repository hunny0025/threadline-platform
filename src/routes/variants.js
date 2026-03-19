const express = require('express');
const router = express.Router({ mergeParams: true });
const { getVariants, checkStock } = require('../controllers/variantController');

router.get('/', getVariants);
router.get('/check-stock', checkStock);

module.exports = router;