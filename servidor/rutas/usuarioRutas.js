const express = require("express");
const router = express.Router();
const controladorUsuario = require("../controladores/usuarioControlador");

// Ruta protegida para obtener el perfil del usuario
router.get("/perfil", (peticion, respuesta) => {
  respuesta.json({ usuario: peticion.usuario });
});

// Rutas para listas
router.post('/usuarios/:id/listas', controladorUsuario.crearLista);
router.post('/usuarios/listas/:listaId', controladorUsuario.agregarLibroALista);
router.delete('/usuarios/:usuarioId/listas/:listaId', controladorUsuario.eliminarLista);
router.get("/usuarios/:usuarioId/listas", (peticion, respuesta, siguiente) => {
  console.log("Ruta /usuarios/:id/listas llamada");
  siguiente();
}, controladorUsuario.obtenerListas);

module.exports = router;
