import React, { createContext, useState, useEffect } from 'react';

export const AuthContexto = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const confirmarAuth = async () => {
      try {
        const respuesta = await fetch('/api/auth/verificar', {
          method: 'GET',
          credentials: 'include'
        });

        if (respuesta.ok) {
          const data = await respuesta.json();
          setIsAuthenticated(true);
          setUsuario(data.usuario);
        } else {
          setIsAuthenticated(false);
          setUsuario(null);
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        setIsAuthenticated(false);
        setUsuario(null);
      }
    };

    confirmarAuth();
  }, []);

  return (
    <AuthContexto.Provider value={{ isAuthenticated, usuario }}>
      {children}
    </AuthContexto.Provider>
  );
};
