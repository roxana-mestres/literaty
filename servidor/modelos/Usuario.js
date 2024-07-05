const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListaSchema = new Schema({
  nombre: { type: String, required: true },
  icono: { type: String },
  editable: { type: Boolean, default: false },
  libros: [String],
});

const usuarioSchema = new Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: Number, required: true },
    password: { type: String, required: true },
    listas: [ListaSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Usuario', usuarioSchema);
