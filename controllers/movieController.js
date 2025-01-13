const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const Movie = require('../models/Movie');

// Controller to get all movies
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.render('index', { movies });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching movies', error: err });
  }
};

// Controller to get a specific movie for seat reservation

exports.getMovieById = async (req, res) => {
  try {
    // Validate Movie ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Movie ID' });
    }

    // Fetch movie details
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Fetch reserved seats
    const reservations = await Reservation.find({ movieId: movie._id });
    const reservedSeats = reservations.flatMap(res => res.seats);

    // Render the seat-reservation view
    res.render('seat-reservation', { movie, reservedSeats });
  } catch (err) {
    console.error('Error fetching movie details:', err);
    res.status(500).json({
      message: 'Error fetching movie details',
      error: err.message || 'Unknown error',
    });
  }
};
