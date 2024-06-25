const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const authRutas = require("./rutas/authRutas");
const cors = require("cors");

// Configuración variables de entorno desde .env
dotenv.config();

// Inicializar Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());
app.use(cookieParser());

// Configurar CORS para permitir todas las solicitudes desde el puerto 5173
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Conectar a la base de datos MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conexión a MongoDB establecida"))
  .catch((error) => console.log("Error al conectar a MongDB: ", error));

// Usar rutas definidas en authRutas
app.use("/api", authRutas);

// Ruta principal para servir el archivo index.html
app.get("/", (peticion, respuesta) => {
  respuesta.sendFile(path.join(__dirname, "../../cliente/literaty/index.html"));
});

// Manejo de errores 404
app.use((peticion, respuesta, siguiente) => {
  respuesta.status(404).send("404: Página no encontrada");
});

// Middleware para manejo de errores
app.use((error, peticion, respuesta, siguiente) => {
  console.error(error.stack);
  respuesta.status(500).send("500: Error interno del servidor");
});

app.listen(port, () => {
  console.log(`El servidor está funcionando en el puerto ${port}`);
});
