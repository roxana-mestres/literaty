const express = require("express");
const path = require("path");
const router = express.Router();
const authRutas = require("./rutas/authRutas");
const app = express();
const port = process.env.PORT || 3000;

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, "../cliente/literaty")));

// Usar rutas definidas en authRutas
app.use("/", authRutas);

// Ruta principal para servir el archivo index.html
router.get("/", (peticion, respuesta) => {
  respuesta.sendFile(path.join(__dirname, "../../cliente/literaty/index.html"));
});

app.listen(port, () => {
  console.log(`El servidor está funcionando en el puerto ${port}`);
});
