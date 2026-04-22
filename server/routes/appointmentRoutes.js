const express = require('express');
const { bookAppointment, getAvailableSlots, getUserAppointments, getBarberSchedule } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/book', protect, bookAppointment);
router.get('/slots', getAvailableSlots);
router.get('/my-appointments', protect, getUserAppointments);
router.get('/barber-schedule', protect, authorize('barber', 'admin'), getBarberSchedule);

module.exports = router;
