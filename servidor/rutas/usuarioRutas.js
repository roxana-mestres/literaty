const express = require("express");
const router = express.Router();

router.get("/perfil", (peticion, respuesta) => {
  respuesta.json({ usuario: peticion.usuario });
});

module.exports = router;
