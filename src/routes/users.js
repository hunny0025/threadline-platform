const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { 
  getProfile, 
  updateProfile,
  getAddresses,
  addAddress,
  setDefaultAddress,
  deleteAddress
} = require('../controllers/userController');

// Profile routes
router.get('/:id/profile', auth, getProfile);
router.patch('/:id/profile', auth, upload.single('avatar'), updateProfile);

// Address routes
router.get('/:id/addresses', auth, getAddresses);
router.post('/:id/addresses', auth, addAddress);
router.patch('/:id/addresses/:addressId/default', auth, setDefaultAddress);
router.delete('/:id/addresses/:addressId', auth, deleteAddress);

module.exports = router;