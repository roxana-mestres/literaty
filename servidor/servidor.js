const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../cliente/literaty")));

app.get("/", (peticion, respuesta) => {
  respuesta(path.join(__dirname, "../cliente/literaty/index.html"));
});

app.listen(port, () => {
  console.log(`El servidor está funcionando en el puerto ${port}`);
});
