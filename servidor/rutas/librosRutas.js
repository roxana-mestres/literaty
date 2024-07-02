const express = require("express");
const router = express.Router();
const { buscarLibros, obtenerLibros } = require("../controladores/librosControlador");

// Ruta para buscar libros
router.get("/buscar", buscarLibros);

// Ruta para obtener libros aleatorios
router.post("/libros", obtenerLibros);

module.exports = router;
