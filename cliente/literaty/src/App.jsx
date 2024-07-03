import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LibrosProvider } from "./contextos/contextoLibros";
import PaginaInicio from "./paginas/PaginaInicio";
import PaginaIniciarSesion from "./paginas/PaginaIniciarSesion";
import PaginaCrearCuenta from "./paginas/PaginaCrearCuenta";
import PaginaPerfil from "./paginas/PaginaPerfil";
import PaginaResena from "./paginas/PaginaResena"
import Pagina401 from "./paginas/Pagina401";
import Pagina404 from "./paginas/Pagina404";

function App() {
  return (
    <LibrosProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PaginaInicio />} />
          <Route path="/iniciar-sesion" element={<PaginaIniciarSesion />} />
          <Route path="/crear-cuenta" element={<PaginaCrearCuenta />} />
          <Route path="/perfil" element={<PaginaPerfil />} />
          <Route path="/resena" element={<PaginaResena />} />
          <Route path="/pagina-401" element={<Pagina401 />} />
          <Route path="/pagina-404" element={<Pagina404 />} />
          <Route path="*" element={<Navigate to="/pagina-404" />} />
        </Routes>
      </Router>
      </LibrosProvider>
  );
}

export default App;
