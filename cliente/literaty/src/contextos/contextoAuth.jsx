import React, { createContext, useState, useEffect } from "react";

export const AuthContexto = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        const respuesta = await fetch("http://localhost:3000/api/verificar-token", {
          method: "GET",
          credentials: "include",
        });

        if (respuesta.ok) {
          setIsAuthenticated(true);
        } else if (respuesta.status === 401) {
          const refrescoExitoso = await refrescarToken();
          setIsAuthenticated(refrescoExitoso);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setCargando(false);
      }
    };

    verificarAutenticacion();
  }, []);

  const iniciarSesion = (token) => {
    setIsAuthenticated(true);
  };

  const cerrarSesion = () => {
    setIsAuthenticated(false);
  };

  const renovarToken = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/renovar-token", {
        method: "POST",
        credentials: "include",
      });

      if (respuesta.ok) {
        return true;
      } else {
        throw new Error("No se pudo renovar el token.");
      }
    } catch (error) {
      console.error("Error al renovar el token:", error);
      return false;
    }
  };

  return (
    <AuthContexto.Provider value={{ isAuthenticated, iniciarSesion, cerrarSesion, cargando, renovarToken}}>
      {children}
    </AuthContexto.Provider>
  );
};
