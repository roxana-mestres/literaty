import React, { createContext, useState, useContext, useEffect } from "react";

const ListasContexto = createContext();

export const useListas = () => useContext(ListasContexto);

export const ListasProvider = ({ children }) => {
  const [listas, setListas] = useState([]);
  const [cargandoListas, setCargandoListas] = useState(false);
  const [librosFavoritos, setLibrosFavoritos] = useState([]);


  useEffect(() => {
    obtenerListas();
  }, []);

  useEffect(() => {
    const listaMeGusta = listas.find((lista) => lista.nombre === "Me gusta");
    if (listaMeGusta) {
      setLibrosFavoritos(listaMeGusta.libros);
      console.log("IDs de libros favoritos contextoListas:", listaMeGusta.libros);
    }
  }, [listas]);

  const obtenerListas = async () => {
    setCargandoListas(true);
    const usuarioId = "668e5211621febe6145303b4";
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/listas/${usuarioId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await respuesta.json();
      setListas(data);
    } catch (error) {
      console.error("Error al obtener listas:", error);
    }
    setCargandoListas(false);
  };

  const agregarLibroALista = async (listaId, libro, libroId) => {
    console.log("Agregar libro a lista:", { listaId, libro });
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/listas/${listaId}/libros`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usuarioId: "668e5211621febe6145303b4",
            libroId: libro.id,
            libroIdMeGusta: libroId
          }),
        }
      );
      if (respuesta.ok) {
        const data = await respuesta.json();
        console.log(data);
        await obtenerListas();
        alert(`El libro se ha añandido correctamente a la lista.`);
      } else {
        console.error(
          "Error al agregar libro a la lista:",
          respuesta.statusText
        );
      }
    } catch (error) {
      console.error("Error al agregar libro a la lista:", error);
    }
  };

  const eliminarLibroDeLista = async (listaId, libroId) => {
    const usuarioId = "668e5211621febe6145303b4";
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/listas/${usuarioId}/${listaId}/libros/${libroId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (respuesta.ok) {
        obtenerListas();
      } else {
        console.error("Error al eliminar libro de la lista");
      }
    } catch (error) {
      console.error("Error al eliminar libro de la lista:", error);
    }
  };

  const eliminarLista = async (listaId) => {
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/listas/${listaId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (respuesta.ok) {
        await obtenerListas();
      } else {
        console.error("Error al eliminar la lista:", respuesta.statusText);
      }
    } catch (error) {
      console.error("Error al eliminar la lista:", error);
    }
  };

  return (
    <ListasContexto.Provider
      value={{
        listas,
        cargandoListas,
        agregarLibroALista,
        eliminarLibroDeLista,
        eliminarLista,
        librosFavoritos,
      }}
    >
      {children}
    </ListasContexto.Provider>
  );
};
