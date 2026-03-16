const express = require('express');
const router = express.Router();
const { filterProducts } = require('../controllers/productController');

router.get('/', (req, res) => {
  res.json({ message: 'Get all products' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get product ${req.params.id}` });
});

router.post('/filter', (req, res, next) => filterProducts(req, res, next));

module.exports = router;