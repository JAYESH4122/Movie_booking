const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// Get all reservations (Admin view)
router.get('/', reservationController.getAllReservations);

module.exports = router;
