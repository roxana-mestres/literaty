import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUsuario } from './contextoUsuario';

const LibrosContexto = createContext();

export const useLibros = () => useContext(LibrosContexto);

export const LibrosProvider = ({ children }) => {
  const { usuario, cargando: cargandoUsuario } = useUsuario();
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  console.log("ID de usuario en contextoLibros:", usuario._id);
  console.log("usuario en contextoLibros:", usuario);

  useEffect(() => {
    if (!cargandoUsuario && usuario._id) {
      obtenerLibros();
    }
  }, [usuario, cargandoUsuario]);

  const obtenerLibros = async (intentos = 3) => {
    setCargando(true);
    let data = [];
    const usuarioId = usuario._id;

    if (!usuarioId) {
      setError("No se pudo obtener el ID del usuario.");
      setCargando(false);
      return;
    }

    for (let i = 0; i < intentos; i++) {
      try {
        const respuesta = await fetch("http://localhost:3000/api/libros", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify({ usuarioId }) // Enviar el ID del usuario en el cuerpo de la solicitud si es necesario
        });

        if (respuesta.ok) {
          data = await respuesta.json();
          if (data.length >= 12) {
            break;
          }
        } else {
          console.error("Error al obtener libros");
        }
      } catch (error) {
        console.error("Error al obtener libros:", error);
      }

      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000));
    }

    setLibros(data);
    setCargando(false);
  };

  const handleEliminarLibro = async (libroId) => {
    if (cargandoUsuario) return;

    const usuarioId= usuario._id;

    if (!usuarioId) {
      setError("No se pudo obtener el ID del usuario.");
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:3000/api/libros/${libroId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ usuarioId }) 
      });

      if (respuesta.ok) {
        setLibros((prevLibros) =>
          prevLibros.filter((libro) => libro.id !== libroId)
        );
      } else {
        console.error("Error al eliminar libro");
      }
    } catch (error) {
      console.error("Error al eliminar libro:", error);
    }
  };

  return (
    <LibrosContexto.Provider value={{ libros, cargando, error, obtenerLibros, handleEliminarLibro }}>
      {children}
    </LibrosContexto.Provider>
  );
};
