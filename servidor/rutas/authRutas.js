const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/authMiddleware");
const { crearCuenta, iniciarSesion, cerrarSesion, accesoRutaProtegida, refrescarToken } = require("../controladores/authControlador");

router.get('/verificar-token', verificarToken, (peticion, respuesta) => {
    respuesta.json({ message: 'Token es válido', usuario: peticion.usuario });
  });
router.get('/ruta-protegida', verificarToken, accesoRutaProtegida);
router.post("/iniciar-sesion", iniciarSesion);
router.post("/refrescar-token", refrescarToken);
router.post("/crear-cuenta", crearCuenta);
router.post("/cerrar-sesion", cerrarSesion);

module.exports = router;