import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginaInicio from "./paginas/PaginaInicio";
import PaginaIniciarSesion from "./paginas/PaginaIniciarSesion";
import PaginaCrearCuenta from "./paginas/PaginaCrearCuenta";

function App() {
  return (
    <Router>
    <Routes>
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/iniciar-sesion" element={<PaginaIniciarSesion />} />
        <Route path="/crear-cuenta" element={<PaginaCrearCuenta />} />
    </Routes>
    </Router>
  );
}

export default App;
