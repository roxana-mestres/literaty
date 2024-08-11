import React, { createContext, useState, useEffect, useContext } from 'react';

const UsuarioContexto = createContext();

export const useUsuario = () => useContext(UsuarioContexto);

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState({
    _id: '',
    nombre: '',
    email: '',
    avatar: '',
    createdAt: '',
    updatedAt: '',
    listas: [],
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        console.log("Iniciando la solicitud para obtener los datos del usuario...");
        const respuesta = await fetch('http://localhost:3000/api/usuario/por-token', {
          method: 'GET',
          credentials: 'include',
        });
        console.log("Respuesta recibida:", respuesta);
  
        if (!respuesta.ok) {
          console.log('La respuesta no fue satisfactoria. Código de estado:', respuesta.status);
          throw new Error('Error al obtener los datos del usuario');
        }
  
        const datosUsuario = await respuesta.json();
        console.log("Datos del usuario recibidos:", datosUsuario);
        const { password, ...usuarioSinPassword } = datosUsuario;
        setUsuario(usuarioSinPassword);
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      } finally {
        console.log("Finalizó la solicitud para obtener los datos del usuario.");
        setCargando(false);
      }
    };
  
    fetchUsuario();
  }, []);

  const actualizarDataUsuario = (dataUsuarioActualizada) => {
    setUsuario(dataUsuarioActualizada);
  };

  console.log("Renderizando UsuarioProvider con el usuario:", usuario);

  return (
    <UsuarioContexto.Provider value={{ usuario, actualizarDataUsuario, cargando }}>
      {children}
    </UsuarioContexto.Provider>
  );
};