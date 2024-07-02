const express = require("express");
const router = express.Router();

// Ruta protegida para obtener el perfil del usuario
router.get("/perfil", (peticion, respuesta) => {
  respuesta.json({ usuario: peticion.usuario });
});

module.exports = router;
