import React, { createContext, useState, useContext, useEffect } from "react";

const ListasContexto = createContext();

export const useListas = () => useContext(ListasContexto);

export const ListasProvider = ({ children }) => {
  const [listas, setListas] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [cambiado, setCambiado] = useState(false);
  const [listasSeleccionadas, setListasSeleccionadas] = useState([]);
  const [cargandoListas, setCargandoListas] = useState(false);
  const [librosFavoritos, setLibrosFavoritos] = useState([]);

  useEffect(() => {
    obtenerListas();
  }, []);

  useEffect(() => {
    const listaMeGusta = listas.find((lista) => lista.nombre === "Me gusta");
    if (listaMeGusta) {
      setLibrosFavoritos(listaMeGusta.libros);
      console.log(
        "IDs de libros favoritos contextoListas:",
        listaMeGusta.libros
      );
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
            libroIdMeGusta: libroId,
          }),
        }
      );
      if (respuesta.ok) {
        const data = await respuesta.json();
        console.log(data);
        await obtenerListas();
        
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
  
  const handleHeartClick = async (libroId) => {
    if (!libroId) {
      console.log("libroId en contextoListas", libroId);
      alert("El libro no tiene un ID válido.");
      return;
    }
  
    try {
      const listaMeGusta = listas.find((lista) => lista.nombre === "Me gusta");
  
      if (!listaMeGusta) {
        console.error("No se encontró la lista 'Me gusta'");
        alert("No se encontró la lista 'Me gusta'");
        return;
      }
  
      console.log("ID del libro seleccionado:", libroId);
  
      const libroEnLista = listaMeGusta.libros.includes(libroId);
  
      if (!libroEnLista) {
        await agregarLibroALista(listaMeGusta._id, { id: libroId }, libroId);
        alert("El libro ha sido añadido correctamente a la lista 'Me gusta'.");
      } else {
        await eliminarLibroDeLista(listaMeGusta._id, libroId);
        alert("El libro ha sido eliminado correctamente de la lista 'Me gusta'.");
      }
    } catch (error) {
      console.error("Error al guardar en listas:", error);
      alert("Hubo un error al intentar guardar el libro en las listas.");
    }
  };  

  const abrirPopupLista = (libro) => {
    setLibroSeleccionado(libro);
    setPopupVisible(true);
  };

  const cerrarPopupLista = () => {
    setPopupVisible(false);
    setLibroSeleccionado(null);
  };

  const handleBookmarkClick = async (libroId) => {
    if (!libroId) {
      console.log("libroId en contextoListas", libroId);
      alert("El libro no tiene un ID válido.");
      return;
    }

    try {
      const listaMeGusta = listas.find((lista) => lista.nombre === "Me gusta");

      if (!listaMeGusta) {
        console.error("No se encontró la lista 'Me gusta'");
        alert("No se encontró la lista 'Me gusta'");
        return;
      }

      console.log("ID del libro seleccionado:", libroId);

      const libroEnLista = listaMeGusta.libros.includes(libroId);

      if (!libroEnLista) {
        await agregarLibroALista(listaMeGusta._id, { id: libroId });
      } else {
        await eliminarLibroDeLista(listaMeGusta._id, libroId);
       
      }
    } catch (error) {
      console.error("Error al guardar en listas:", error);
      alert("Hubo un error al intentar guardar el libro en las listas.");
    }
  };

  const handleCambioCheckbox = (listaId) => {
    setListasSeleccionadas((prev) => {
      if (prev.includes(listaId)) {
        return prev.filter((id) => id !== listaId);
      } else {
        return [...prev, listaId];
      }
    });
    setCambiado(true);
  };

  const handleGuardarEnListas = async () => {
    if (!libroSeleccionado) return;
  
    const listasParaEliminar = listas
      .filter((lista) => !listasSeleccionadas.includes(lista._id) && lista.libros.includes(libroSeleccionado.id))
      .map((lista) => lista._id);
  
    const listasParaAgregar = listasSeleccionadas.filter((id) => !listas.find((lista) => lista._id === id).libros.includes(libroSeleccionado.id));
  
    let mensaje = '';
  
    try {
      // Eliminar libro de listas que ya no están seleccionadas
      for (const listaId of listasParaEliminar) {
        await eliminarLibroDeLista(listaId, libroSeleccionado.id);
      }
  
      // Agregar libro a listas nuevas
      for (const listaId of listasParaAgregar) {
        await agregarLibroALista(listaId, libroSeleccionado);
      }
  
      // Construir el mensaje de alerta
      if (listasParaEliminar.length > 0) {
        mensaje += "El libro ha sido eliminado correctamente de las listas.";
      }
  
      if (listasParaAgregar.length > 0) {
        if (mensaje) mensaje += " ";
        mensaje += "El libro ha sido añadido correctamente a las listas.";
      }
  
      return mensaje || "No se realizaron cambios.";
    } catch (error) {
      console.error("Error al guardar en listas:", error);
      alert("Hubo un error al intentar guardar el libro en las listas.");
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
        popupVisible,
        libroSeleccionado,
        listasSeleccionadas,
        cambiado,
        handleHeartClick,
        abrirPopupLista,
        cerrarPopupLista,
        handleBookmarkClick,
        handleCambioCheckbox,
        handleGuardarEnListas,
      }}
    >
      {children}
    </ListasContexto.Provider>
  );
};
