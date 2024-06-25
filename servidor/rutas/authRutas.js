const express = require("express");
const router = express.Router();
const { crearCuenta, iniciarSesion, cerrarSesion } = require("../controladores/authControlador");

// Ruta POST para enviar datos del formulario de inicio de sesión al servidor
router.post("/iniciar-sesion", iniciarSesion);

// Ruta POST para enviar datos del formulario de crear cuenta al servidor
router.post("/crear-cuenta", crearCuenta);

// Ruta POST para cerrar sesión
router.post("/cerrar-sesion", cerrarSesion);

module.exports = router;