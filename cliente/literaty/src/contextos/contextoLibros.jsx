import React, { createContext, useState, useContext, useEffect } from 'react';

const LibrosContexto = createContext();

export const useLibros = () => useContext(LibrosContexto);

export const LibrosProvider = ({ children }) => {
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [emailUsuario, setEmailUsuario] = useState('roxana.mestres@hotmail.com');

  useEffect(() => {
    const librosGuardados = localStorage.getItem("libros");
    if (librosGuardados) {
      setLibros(JSON.parse(librosGuardados));
    } else {
      obtenerLibros();
    }
  }, []);

  const obtenerLibros = async (intentos = 3) => {
    setCargando(true);
    let data = [];
    for (let i = 0; i < intentos; i++) {
      try {
        const respuesta = await fetch("http://localhost:3000/api/libros", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: emailUsuario }),
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

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    setLibros(data);
    setCargando(false);
  };

  const handleEliminarLibro = async (id) => {
    const emailUsuario = "roxana.mestres@hotmail.com";
    try {
      const respuesta = await fetch(`http://localhost:3000/api/libros/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailUsuario }),
      });

      if (respuesta.ok) {
        setLibros((prevLibros) =>
          prevLibros.filter((libro) => libro.id !== id)
        );
      } else {
        console.error("Error al eliminar libro");
      }
    } catch (error) {
      console.error("Error al eliminar libro:", error);
    }
  };

  return (
    <LibrosContexto.Provider value={{ libros, setLibros, cargando, obtenerLibros, handleEliminarLibro }}>
      {children}
    </LibrosContexto.Provider>
  );
};
