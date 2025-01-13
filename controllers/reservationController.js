const Reservation = require('../models/Reservation');
const Movie = require('../models/Movie');

// Controller to handle seat reservation
// Controller to handle seat reservation
exports.reserveSeats = async (req, res) => {
  const { seats, user } = req.body;
  const movieId = req.params.id;

  try {
    // Check if the user already has a reservation
    const existingReservation = await Reservation.findOne({ user });

    if (existingReservation) {
      // If a reservation already exists for this user, return an error message
      return res.status(400).json({ message: 'This user has already reserved seats.' });
    }

    // Save the reservation in the database
    const reservation = new Reservation({
      movieId,
      seats,
      user,
    });

    await reservation.save();

    // Redirect to the ticket view with reservation details
    res.redirect(`/ticket/${reservation._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error reserving seats', error: err });
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
