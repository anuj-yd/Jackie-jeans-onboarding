const express = require('express');
const router = express.Router();
const {
  createProfile,
  getProfile,
} = require('../controllers/profileController');

router.route('/').post(createProfile);
router.route('/:id').get(getProfile);

module.exports = router;
