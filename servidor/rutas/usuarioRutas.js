const express = require("express");
const router = express.Router();
const usuarioControlador = require('../controladores/usuarioControlador');

router.get("/perfil", (peticion, respuesta) => {
  respuesta.json({ usuario: peticion.usuario });
});

router.get('/usuario/:usuarioId', usuarioControlador.obtenerUsuario);

module.exports = router;
