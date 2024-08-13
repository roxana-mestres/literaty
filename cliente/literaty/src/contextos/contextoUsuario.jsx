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
    console.log("Inicio de fetchUsuario");
    try {
      const respuesta = await fetch('http://localhost:3000/api/usuario/por-token', {
        method: 'GET',
        credentials: 'include',
      });

      console.log("Respuesta de fetchUsuario:", respuesta);
      if (respuesta.status === 401) {
        console.log("Token expirado, intentando renovar...");
        const tokenRenovado = await renovarToken();
        if (tokenRenovado) {
          console.log("Token renovado exitosamente");
          return fetchUsuario();
        } else {
          throw new Error("Error al renovar el token.");
        }
      }

      if (!respuesta.ok) {
        throw new Error('Error al obtener los datos del usuario');
      }

      const datosUsuario = await respuesta.json();
      console.log("Datos del usuario recibidos:", datosUsuario);
      const { password, ...usuarioSinPassword } = datosUsuario;
      console.log("Usuario sin contraseña:", usuarioSinPassword);
      setUsuario(usuarioSinPassword);
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    } finally {
      console.log("Finalizando fetchUsuario, cargando:", cargando);
      setCargando(false);
    }
  };

  useEffect(() => {
    console.log("Llamando a fetchUsuario en useEffect");
    fetchUsuario();
  }, []);

  const actualizarDataUsuario = (dataUsuarioActualizada) => {
    console.log("Actualizando datos del usuario:", dataUsuarioActualizada);
    setUsuario(dataUsuarioActualizada);
  };

  console.log("Renderizando UsuarioProvider con el usuario:", usuario);

  return (
    <UsuarioContexto.Provider
      value={{ usuario, actualizarDataUsuario, cargando }}
    >
      {children}
    </UsuarioContexto.Provider>
  );
};
