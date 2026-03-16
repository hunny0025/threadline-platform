const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get all products' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get product ${req.params.id}` });
});

const express = require('express');
const router = express.Router();
const { filterProducts } = require('../controllers/productController');

router.post('/filter', filterProducts);

module.exports = router;
module.exports = router;
