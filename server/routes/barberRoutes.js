const express = require('express');
const { getBarbers, getBarberProfile, updateBarberAvailability } = require('../controllers/barberController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getBarbers);
router.get('/:id', getBarberProfile);
router.put('/availability', protect, authorize('barber'), updateBarberAvailability);

module.exports = router;
