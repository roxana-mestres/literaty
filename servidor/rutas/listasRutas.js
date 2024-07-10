const express = require("express");
const router = express.Router();
const controladorListas = require("../controladores/listasControlador");


router.post('/agregar-lista/:usuarioId', controladorListas.crearLista);
router.delete('/:usuarioId/listas/:listaId', controladorListas.eliminarLista);
router.put('/:usuarioId/listas/:listaId', controladorListas.actualizarNombreLista);
router.get("/listas/:usuarioId", controladorListas.obtenerListas);
router.post('/listas/:listaId/libros', controladorListas.agregarLibroALista);
router.get('/obtener-libros/:usuarioId/:listaId', controladorListas.obtenerLibrosDeLista);
router.delete('/listas/:usuarioId/:listaId/libros/:libroId', controladorListas.eliminarLibroDeLista);


module.exports = router;