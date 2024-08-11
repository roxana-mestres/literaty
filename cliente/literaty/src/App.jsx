import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LibrosProvider } from "./contextos/contextoLibros";
import { ListasProvider } from "./contextos/contextoListas";
import { UsuarioProvider } from "./contextos/contextoUsuario";
import { AuthProvider } from "./contextos/contextoAuth";
import RutaProtegida from "./rutas/rutasProtegidas";
import PaginaInicio from "./paginas/PaginaInicio";
import PaginaIniciarSesion from "./paginas/PaginaIniciarSesion";
import PaginaCrearCuenta from "./paginas/PaginaCrearCuenta";
import PaginaPerfil from "./paginas/PaginaPerfil";
import PaginaResena from "./paginas/PaginaResena";
import PaginaListas from "./paginas/PaginaListas";
import PaginaEditarPerfil from "./paginas/PaginaEditarPerfil";
import Pagina401 from "./paginas/Pagina401";
import Pagina404 from "./paginas/Pagina404";

function App() {
  return (
    <AuthProvider>
      <UsuarioProvider>
        <LibrosProvider>
          <ListasProvider>
            <Router>
              <Routes>
                <Route path="/" element={<PaginaInicio />} />
                <Route
                  path="/iniciar-sesion"
                  element={<PaginaIniciarSesion />}
                />
                <Route path="/crear-cuenta" element={<PaginaCrearCuenta />} />

                {/* Rutas protegidas */}
                <Route
                  path="/perfil"
                  element={
                    <RutaProtegida>
                      <PaginaPerfil />
                    </RutaProtegida>
                  }
                />
                <Route
                  path="/resena"
                  element={
                    <RutaProtegida>
                      <PaginaResena />
                    </RutaProtegida>
                  }
                />
                <Route
                  path="/listas"
                  element={
                    <RutaProtegida>
                      <PaginaListas />
                    </RutaProtegida>
                  }
                />
                <Route
                  path="/editar-perfil"
                  element={
                    <RutaProtegida>
                      <PaginaEditarPerfil />
                    </RutaProtegida>
                  }
                />

                <Route path="/pagina-401" element={<Pagina401 />} />
                <Route path="/pagina-404" element={<Pagina404 />} />
                <Route path="*" element={<Navigate to="/pagina-404" />} />
              </Routes>
            </Router>
          </ListasProvider>
        </LibrosProvider>
      </UsuarioProvider>
    </AuthProvider>
  );
}

export default App;
