import React, { createContext, useState, useEffect, useContext } from 'react';

const UsuarioContexto = createContext();

export const useUsuario = () => useContext(UsuarioContexto);

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState({ nombre: '', avatar: '' });

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const usuarioId = '668e5211621febe6145303b4';
        const respuesta = await fetch(`http://localhost:3000/api/usuario/${usuarioId}`);
        if (!respuesta.ok) {
          throw new Error('Error al obtener los datos del usuario');
        }
        const datosUsuario = await respuesta.json();
        setUsuario(datosUsuario);
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };

    fetchUsuario();
  }, []);

  const actualizarDataUsuario = (dataUsuarioActualizada) => {
    setUsuario(dataUsuarioActualizada);
  };

  return (
    <UsuarioContexto.Provider value={{ usuario, actualizarDataUsuario }}>
      {children}
    </UsuarioContexto.Provider>
  );
};
