import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contextos/contextoAuth';
import PaginaInicio from './paginas/PaginaInicio';
import PaginaIniciarSesion from './paginas/PaginaIniciarSesion';
import PaginaCrearCuenta from './paginas/PaginaCrearCuenta';
import PaginaPerfil from './paginas/PaginaPerfil';
import Pagina401 from './paginas/Pagina401';
import Pagina404 from './paginas/Pagina404';
import RutasProtegidas from './rutas/rutasProtegidas';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PaginaInicio />} />
          <Route path="/iniciar-sesion" element={<PaginaIniciarSesion />} />
          <Route path="/crear-cuenta" element={<PaginaCrearCuenta />} />
          <Route
            path="/perfil"
            element={<RutasProtegidas element={<PaginaPerfil />} />}
          />
          <Route path="/pagina-401" element={<Pagina401 />} />
          <Route path="/pagina-404" element={<Pagina404 />} />
          <Route path="*" element={<Navigate to="/pagina-404" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
