const express = require("express");
const router = express.Router();
const { crearCuenta, iniciarSesion, cerrarSesion } = require("../controladores/authControlador");

router.post("/iniciar-sesion", iniciarSesion);
router.post("/crear-cuenta", crearCuenta);
router.post("/cerrar-sesion", cerrarSesion);

module.exports = router;