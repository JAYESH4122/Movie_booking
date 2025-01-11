const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  movieId: mongoose.Schema.Types.ObjectId,
  seats: [String],
  user: String, // Name of the person reserving
});

module.exports = mongoose.model('Reservation', reservationSchema);
