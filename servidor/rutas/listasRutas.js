const express = require("express");
const router = express.Router();
const controladorListas = require("../controladores/listasControlador");


router.post('/agregar-lista/:usuarioId', controladorListas.crearLista);
router.post('/listas/:listaId/libros', controladorListas.agregarLibroALista);
router.delete('/listas/:usuarioId/:listaId/libros/:libroId', controladorListas.eliminarLibroDeLista);
router.delete('/:usuarioId/listas/:listaId', controladorListas.eliminarLista);
router.get("/listas/:usuarioId", controladorListas.obtenerListas);
router.put('/:usuarioId/listas/:listaId', controladorListas.actualizarNombreLista);

module.exports = router;