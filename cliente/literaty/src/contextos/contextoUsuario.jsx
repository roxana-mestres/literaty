import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthContexto } from "./contextoAuth";

const UsuarioContexto = createContext();

export const useUsuario = () => useContext(UsuarioContexto);

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState({
    _id: "",
    nombre: "",
    email: "",
    avatar: "",
    createdAt: "",
    updatedAt: "",
    listas: [],
  });
  const [cargando, setCargando] = useState(true);
  const { renovarToken } = useContext(AuthContexto);

  const fetchUsuario = async () => {
    try {
      const respuesta = await fetch('https://literaty-backend.onrender.com/api/usuario/por-token', {
        method: 'GET',
        credentials: 'include',
      });
      if (respuesta.status === 401) {
        const tokenRenovado = await renovarToken();
        if (tokenRenovado) {
          return fetchUsuario();
        } else {
          throw new Error("Error al renovar el token.");
        }
      }

      if (!respuesta.ok) {
        throw new Error('Error al obtener los datos del usuario');
      }

      const datosUsuario = await respuesta.json();
      const { password, ...usuarioSinPassword } = datosUsuario;
      setUsuario(usuarioSinPassword);
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchUsuario();
  }, []);

  const actualizarDataUsuario = (dataUsuarioActualizada) => {
    setUsuario(dataUsuarioActualizada);
  };

  return (
    <UsuarioContexto.Provider
      value={{ usuario, actualizarDataUsuario, cargando }}
    >
      {children}
    </UsuarioContexto.Provider>
  );
};
