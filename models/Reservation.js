const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    seats: { type: [String], required: true },
  },
  { timestamps: true } // Enables createdAt and updatedAt fields
);

module.exports = mongoose.model('Reservation', reservationSchema);
