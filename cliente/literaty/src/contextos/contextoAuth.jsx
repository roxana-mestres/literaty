import React, { createContext, useState, useEffect } from "react";

export const AuthContexto = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const respuesta = await fetch("http://localhost:3000/api/verificar-token", {
          method: "GET",
          credentials: "include",
        });

        if (respuesta.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setCargando(false);
      }
    };

    checkAuth();
  }, []);

  const iniciarSesion = (token) => {
    setIsAuthenticated(true);
  };

  const cerrarSesion = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContexto.Provider value={{ isAuthenticated, iniciarSesion, cerrarSesion, cargando }}>
      {children}
    </AuthContexto.Provider>
  );
};
