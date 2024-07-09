const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
  _id: String,
  title: String,
  authors: [String],
  mainCategory: String,
  averageRating: Number,
  image: String,
  description: String,
});

const Libro = mongoose.model('Libro', libroSchema);

module.exports = Libro;