const express = require('express');
const router = express.Router();
const {
  getSwappableSlots,
  createSwapRequest,
  respondToSwapRequest,
  getMySwapRequests,
} = require('../controllers/swapController');
const { protect } = require('../middleware/authMiddleware');

router.get('/swappable-slots', protect, getSwappableSlots);
router.post('/swap-request', protect, createSwapRequest);
router.post('/swap-response/:requestId', protect, respondToSwapRequest);
router.get('/my-requests', protect, getMySwapRequests);

module.exports = router;