const express = require('express');
const router = express.Router();

router.use('/products',    require('./products'));
router.use('/users',       require('./users'));
router.use('/orders',      require('./orders'));
router.use('/auth',        require('./auth'));
router.use('/categories',  require('./categories'));
router.use('/analytics',   require('./analytics'));
router.use('/search',      require('./search'));
router.use('/cart',        require('./cart'));
router.use('/payment',     require('./payment'));
router.use('/content',     require('./content'));
router.use('/newsletter',  require('./newsletter'));
router.use('/wishlist',    require('./wishlist'));
router.use('/coupons',     require('./coupons'));
router.use('/promotions',  require('./promotions'));   

module.exports = router;
