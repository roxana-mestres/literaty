const express = require("express");
const router = express.Router();
const { crearCuenta, iniciarSesion, verificarToken, cerrarSesion } = require("../controladores/authControlador");
const authMiddleware = require('../middlewares/authMiddleware');

router.post("/iniciar-sesion", iniciarSesion);
router.post("/crear-cuenta", crearCuenta);
router.get('/verificar', authMiddleware, verificarToken); 
router.post("/cerrar-sesion", cerrarSesion);

module.exports = router;