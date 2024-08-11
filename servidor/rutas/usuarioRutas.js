const express = require("express");
const router = express.Router();
const usuarioControlador = require('../controladores/usuarioControlador');

router.get('/por-token', usuarioControlador.obtenerUsuarioPorToken);
router.put('/actualizar/:usuarioId', usuarioControlador.actualizarUsuario);
router.put("/actualizar-contrasena/:usuarioId", usuarioControlador.actualizarContrasena);

module.exports = router;
