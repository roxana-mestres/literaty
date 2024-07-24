const express = require("express");
const router = express.Router();
const usuarioControlador = require('../controladores/usuarioControlador');

router.get("/perfil", (peticion, respuesta) => {
  respuesta.json({ usuario: peticion.usuario });
});

router.get('/:usuarioId', usuarioControlador.obtenerUsuario);
router.put('/actualizar/:usuarioId', usuarioControlador.actualizarUsuario);
router.put("/actualizar-contrasena/:usuarioId", usuarioControlador.actualizarContrasena);

module.exports = router;
