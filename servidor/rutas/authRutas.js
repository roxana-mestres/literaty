const express = require("express");
const router = express.Router();
const iniciarSesion = require("../controladores/iniciarSesionControlador");
const crearCuenta = require("../controladores/crearCuentaControlador");

// Ruta POST para enviar datos del formulario de inicio de sesión al servidor
router.post("/api/iniciar-sesion", iniciarSesion);

// Ruta POST para enviar datos del formulario de crear cuenta al servidor
router.post("/api/crear-cuenta", crearCuenta);

module.exports = router;