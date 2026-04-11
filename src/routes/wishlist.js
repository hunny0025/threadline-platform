const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addToWishlist, removeFromWishlist, getWishlist } = require('../controllers/wishlistController');

router.get('/', auth, getWishlist);
router.post('/add', auth, addToWishlist);
router.delete('/remove', auth, removeFromWishlist);

module.exports = router;