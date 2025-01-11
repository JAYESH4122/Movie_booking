const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  name: String,
  date: String,
  time: String,
});

module.exports = mongoose.model('Movie', movieSchema);
