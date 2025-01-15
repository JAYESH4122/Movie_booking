const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const reservationController = require('../controllers/reservationController');

// Get all movies
router.get('/', movieController.getAllMovies);

// Get specific movie and show seat reservation form
router.get('/reserve/:id', movieController.getMovieById);

// Reserve seats for a movie
router.post('/reserv/:id', reservationController.reserveSeats);

// Route to show the ticket
router.get('/ticke/:id', reservationController.getTicket);

module.exports = router;
