const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require('../controllers/addressController');

router.get('/', auth, getAddresses);
router.post('/', auth, addAddress);
router.patch('/:addressId', auth, updateAddress);
router.delete('/:addressId', auth, deleteAddress);
router.patch('/:addressId/set-default', auth, setDefaultAddress);

module.exports = router;