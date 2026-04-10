const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addToWishlist, removeFromWishlist, getWishlist } = require('../controllers/wishlistController');

router.get('/:userId', auth, getWishlist);
router.post('/:userId/add', auth, addToWishlist);
router.delete('/:userId/remove', auth, removeFromWishlist);

module.exports = router;
