const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const Movie = require('../models/Movie');
const { render } = require('ejs');


exports.reserveSeats = async (req, res) => {
  const { seats, user } = req.body;
  const movieId = req.params.id;

  try {
    // Fetch the movie and reserved seat
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).render('error', { message: 'Movie not found' });
    }

    const reservations = await Reservation.find({ movieId });
    const reservedSeats = reservations.flatMap(res => res.seats);

    // Check if user already has a reservation
    const existingReservation = await Reservation.findOne({ user });
    if (existingReservation) {
      return res.render('seat-reservation', {
        movie,
        errorMessage: 'This user has already reserved seats.',
        reservedSeats,
      });
    }

    // Validate seat selection
    const seatArray = seats.split(',');
    if (seatArray.length > 2) {
      return res.render('seat-reservation', {
        movie,
        errorMessage: 'You can only reserve up to 2 seats.',
        reservedSeats,
      });
    }

    // Save the reservation
    const reservation = new Reservation({
      movieId,
      seats: seatArray,
      user,
    });
    await reservation.save();

    // Redirect to the ticket view
    res.redirect(`/ticket/${reservation._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).render('seat-reservation', {
      movie: await Movie.findById(movieId),
      errorMessage: 'An error occurred while processing your reservation.',
      reservedSeats: reservedSeats || [],
    });
  }
};


// Controller to display the ticket
exports.getTicket = async (req, res) => {
  const reservationId = req.params.id;

  try {
    // Fetch the reservation
    const reservation = await Reservation.findById(reservationId).populate('movieId');
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Fetch the movie details
    const movie = await Movie.findById(reservation.movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie details not found' });
    }

    // Pass reservation and movie details to the ticket view
    res.render('ticket', { reservation, movie });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching ticket details', error: err });
  }
};



// Controller to get all reservations (for Admin)
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('movieId');
    res.render('admin', { reservations });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reservations', error: err });
  }
};
