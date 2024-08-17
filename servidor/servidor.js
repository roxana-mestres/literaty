const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const authRutas = require("./rutas/authRutas");
const listasRutas = require("./rutas/listasRutas");
const librosRutas = require("./rutas/librosRutas");
const usuarioRutas = require("./rutas/usuarioRutas");
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

// Rutas
app.use("/api", authRutas);
app.use('/api', listasRutas);
app.use("/api", librosRutas);
app.use("/api/usuario", usuarioRutas);

// *** SERVIR LOS ARCHIVOS ESTÁTICOS DEL FRONTEND ***
app.use(express.static(path.join(__dirname, '../cliente/literaty/dist')));

// *** CAPTURAR TODAS LAS DEMÁS RUTAS Y DEVOLVER EL index.html ***
app.get('*', (peticion, respuesta) => {
  respuesta.sendFile(path.join(__dirname, '../cliente/literaty/dist', 'index.html'));
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
