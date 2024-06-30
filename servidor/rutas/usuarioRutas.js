const express = require("express");
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Ruta protegida para obtener el perfil del usuario
router.get('/perfil', authMiddleware, (peticion, respuesta) => {
  respuesta.json({ usuario: peticion.usuario });
});

module.exports = router;
