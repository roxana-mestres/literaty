const express = require("express");
const router = express.Router();
const { buscarLibros, obtenerLibros, eliminarLibro} = require("../controladores/librosControlador");

// Ruta para buscar libros
router.get("/buscar", buscarLibros);

// Ruta para obtener libros
router.post("/libros", obtenerLibros);

// Ruta para eliminar libros
router.delete("/libros/:id", eliminarLibro);

module.exports = router;
