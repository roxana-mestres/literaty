import React, { createContext, useState, useContext, useEffect } from "react";
import { useUsuario } from "./contextoUsuario";
import { AuthContexto } from "./contextoAuth";

const ListasContexto = createContext();

export const useListas = () => useContext(ListasContexto);

export const ListasProvider = ({ children }) => {
  const { usuario: dataUsuario } = useUsuario();
  const { renovarToken } = useContext(AuthContexto);
  const [listas, setListas] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [cambiado, setCambiado] = useState(false);
  const [listasSeleccionadas, setListasSeleccionadas] = useState([]);
  const [cargandoListas, setCargandoListas] = useState(false);
  const [librosFavoritos, setLibrosFavoritos] = useState([]);
  const [librosGuardados, setLibrosGuardados] = useState([]);

  useEffect(() => {
    if (dataUsuario && dataUsuario._id) {
      obtenerListas();
    }
  }, [dataUsuario]);

  useEffect(() => {
    if (listas.length > 0) {
      const listaMeGusta = listas.find((lista) => lista.nombre === "Me gusta");
      if (listaMeGusta) {
        setLibrosFavoritos(listaMeGusta.libros);
      }

      const librosEnGuardados = listas
        .filter((lista) => lista.nombre !== "Me gusta")
        .flatMap((lista) => lista.libros);

      setLibrosGuardados(librosEnGuardados);
    }
  }, [listas]);

  const obtenerListas = async () => {
    setCargandoListas(true);
    const usuarioId = dataUsuario._id;
    
    try {
      let respuesta = await fetch(
        `https://literaty-backend.onrender.com/api/listas/${usuarioId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
  
      if (respuesta.status === 401) {
        const tokenRenovado = await renovarToken();
        if (tokenRenovado) {
          respuesta = await fetch(
            `https://literaty-backend.onrender.com/api/listas/${usuarioId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );
        } else {
          throw new Error("Error al renovar el token.");
        }
      }
  
      if (!respuesta.ok) {
        throw new Error('Error al obtener listas');
      }
  
      const data = await respuesta.json();
      setListas(data);
  
      const listaMeGusta = data.find((lista) => lista.nombre === "Me gusta");
      if (listaMeGusta) {
        setLibrosFavoritos(listaMeGusta.libros);
      }
  
      const librosEnGuardados = data
        .filter((lista) => lista.nombre !== "Me gusta")
        .flatMap((lista) => lista.libros);
  
      setLibrosGuardados(librosEnGuardados);
    } catch (error) {
      console.error("Error al obtener listas:", error);
    } finally {
      setCargandoListas(false);
    }
  };

  const agregarLibroALista = async (listaId, libro, libroId) => {
    const usuarioId = dataUsuario._id;

    try {
      const respuesta = await fetch(
        `https://literaty-backend.onrender.com/api/listas/${listaId}/libros`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usuarioId,
            libroId: libro.id || libro._id,
          }),
        }
      );
      if (respuesta.ok) {
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
    const usuarioId = dataUsuario._id;

    try {
      const respuesta = await fetch(
        `https://literaty-backend.onrender.com/api/listas/${usuarioId}/${listaId}/libros/${libroId}`,
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
    const usuarioId = dataUsuario._id;

    try {
      const respuesta = await fetch(
        `https://literaty-backend.onrender.com/api/listas/${usuarioId}/${listaId}`,
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

      const libroEnLista = listaMeGusta.libros.includes(libroId);

      if (!libroEnLista) {
        await agregarLibroALista(listaMeGusta._id, { id: libroId }, libroId);
        alert("El libro ha sido añadido correctamente a la lista 'Me gusta'.");
        setLibrosFavoritos((prev) => [...prev, libroId]);
      } else {
        await eliminarLibroDeLista(listaMeGusta._id, libroId);
        alert(
          "El libro ha sido eliminado correctamente de la lista 'Me gusta'."
        );
        setLibrosFavoritos((prev) => prev.filter((id) => id !== libroId));
      }
    } catch (error) {
      console.error("Error al guardar en listas:", error);
      alert("Hubo un error al intentar guardar el libro en las listas.");
    }
  };

  const abrirPopupLista = (libro) => {
    setLibroSeleccionado(libro);
    setPopupVisible(true);

    const listasQueContienenElLibro = listas
      .filter((lista) => lista.libros.includes(libro.id))
      .map((lista) => lista._id);

    setListasSeleccionadas(listasQueContienenElLibro);
  };

  const cerrarPopupLista = () => {
    setPopupVisible(false);
    setLibroSeleccionado(null);
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

    const obtenerIdLibro = (libro) => libro._id || libro.id;
    const libroId = obtenerIdLibro(libroSeleccionado);

    const listasParaEliminar = listas
      .filter(
        (lista) =>
          !listasSeleccionadas.includes(lista._id) &&
          lista.libros.includes(libroId)
      )
      .map((lista) => lista._id);

    const listasParaAgregar = listasSeleccionadas.filter(
      (id) =>
        !listas
          .find((lista) => lista._id === id)
          .libros.includes(libroId)
    );

    let mensaje = "";

    try {
      for (const listaId of listasParaEliminar) {
        await eliminarLibroDeLista(listaId, libroId);
      }
      for (const listaId of listasParaAgregar) {
        await agregarLibroALista(listaId, libroSeleccionado);
      }

      await obtenerListas();
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
        librosGuardados,
        popupVisible,
        libroSeleccionado,
        setListasSeleccionadas,
        listasSeleccionadas,
        cambiado,
        handleHeartClick,
        abrirPopupLista,
        cerrarPopupLista,
        handleCambioCheckbox,
        handleGuardarEnListas,
      }}
    >
      {children}
    </ListasContexto.Provider>
  );
};