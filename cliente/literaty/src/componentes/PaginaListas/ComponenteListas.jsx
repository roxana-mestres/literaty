import React, { useState, useEffect, useContext } from "react";
import { useListas } from "../../contextos/contextoListas";
import { useUsuario } from "../../contextos/contextoUsuario";
import { AuthContexto } from "../../contextos/contextoAuth";
import { Link } from "react-router-dom";
import estilos from "../../estilos/Comunes.module.css";
import resena from "../../estilos/PaginaResena.module.css";
import listas from "../../estilos/estilosListas.module.css";
import principal from "../../estilos/PaginaPrincipal.module.css";
import ItemLibro from "../PaginaPerfil/ComponenteItemLibro";
import ComponentePopupListas from "../../componentes/PaginaListas/ComponentePopupListas";

const iconosLibros = [
  "/src/assets/libro-1.svg",
  "/src/assets/libro-2.svg",
  "/src/assets/libro-3.svg",
  "/src/assets/libro-4.svg",
  "/src/assets/libro-5.svg",
  "/src/assets/libro-6.svg",
];

function ComponenteListas() {
  const { usuario: dataUsuario } = useUsuario();
  const { renovarToken } = useContext(AuthContexto);
  const [listasDeLibros, setListasDeLibros] = useState([]);
  const [librosDeLista, setLibrosDeLista] = useState([]);
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(null);
  const [nombreListaSeleccionada, setNombreListaSeleccionada] = useState();
  const { librosFavoritos, popupVisible, cerrarPopupLista, libroSeleccionado } =
    useListas();

  const usuarioId = dataUsuario?._id;

  const manejarErrorYReintentar = async (funcion, ...params) => {
    try {
      return await funcion(...params);
    } catch (error) {
      if (error.message.includes("401")) {
        const tokenRenovado = await renovarToken();
        if (tokenRenovado) {
          return funcion(...params);
        } else {
          throw new Error("No se pudo renovar el token.");
        }
      } else {
        throw error;
      }
    }
  };

  useEffect(() => {
    const fetchListas = async () => {
      try {
        console.log(`Fetching listas for usuarioId: ${usuarioId}`);
        const respuesta = await manejarErrorYReintentar(
          async () => await fetch(`http://localhost:3000/api/listas/${usuarioId}`)
        );

        if (!respuesta.ok) {
          throw new Error("Error al obtener las listas");
        }

        let data = await respuesta.json();
        console.log("Listas obtenidas:", data);

        data = data.map((lista, index) => ({
          ...lista,
          icono: lista.icono || iconosLibros[index % iconosLibros.length],
        }));

        setListasDeLibros(data);

        const almacenadoIndice = localStorage.getItem("indiceSeleccionado");
        if (almacenadoIndice) {
          const listaSeleccionada = data.find(
            (lista) => lista._id === almacenadoIndice
          );
          if (listaSeleccionada) {
            manejarClickLista(listaSeleccionada._id);
          }
        } else {
          const listaMeGusta = data.find(
            (lista) => lista.nombre === "Me gusta"
          );
          if (listaMeGusta) {
            manejarClickLista(listaMeGusta._id);
          }
        }
      } catch (error) {
        console.error("Error al obtener las listas:", error);
      }
    };

    if (usuarioId) { 
      fetchListas();
    }
  }, [usuarioId, librosFavoritos]);

  const agregarLista = async () => {
    try {
      const nuevoIndice = listasDeLibros.length % iconosLibros.length;
      const nuevaLista = {
        nombre: `Nueva Lista ${listasDeLibros.length + 1}`,
        icono: iconosLibros[nuevoIndice],
        editable: false,
        libros: [],
        protegida: false,
      };

      console.log("Enviando solicitud para crear lista con datos:", nuevaLista);

      const respuesta = await manejarErrorYReintentar(
        async () => await fetch(
          `http://localhost:3000/api/agregar-lista/${usuarioId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nombre: nuevaLista.nombre,
              usuarioId: usuarioId,
            }),
          }
        )
      );

      console.log("Respuesta de la solicitud:", respuesta);

      if (respuesta.ok) {
        const data = await respuesta.json();
        console.log("Datos de la respuesta:", data);
        setListasDeLibros([
          ...listasDeLibros,
          { ...nuevaLista, _id: data._id },
        ]);
      } else {
        console.error("Error al crear la lista");
        const errorText = await respuesta.text();
        console.error("Texto del error:", errorText);
      }
    } catch (error) {
      console.error("Error al crear la lista:", error);
    }
  };

  const eliminarLista = async (listaId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta lista?")) {
      console.log("ID de la lista a eliminar:", listaId);
      try {
        const respuesta = await manejarErrorYReintentar(
          async () => await fetch(
            `http://localhost:3000/api/${usuarioId}/listas/${listaId}`,
            {
              method: "DELETE",
            }
          )
        );

        console.log("Respuesta de la solicitud de eliminación:", respuesta);

        if (respuesta.ok) {
          const nuevasListas = listasDeLibros.filter(
            (lista) => lista._id !== listaId
          );
          setListasDeLibros(nuevasListas);
          setIndiceSeleccionado(null);
          console.log("Lista eliminada y estado actualizado.");
        } else {
          console.error(
            "Error al eliminar la lista. Estado:",
            respuesta.status
          );
          const errorText = await respuesta.text();
          console.error("Texto del error:", errorText);
        }
      } catch (error) {
        console.error("Error al eliminar la lista:", error);
      }
    }
  };

  const manejarEditarNombre = (e, listaId) => {
    const nuevoNombre = e.target.value;
    const nuevasListas = listasDeLibros.map((lista) => {
      if (lista._id === listaId) {
        return { ...lista, nombre: nuevoNombre };
      }
      return lista;
    });
    setListasDeLibros(nuevasListas);
  };

  const actualizarNombreLista = async (listaId) => {
    const lista = listasDeLibros.find((lista) => lista._id === listaId);
    if (lista.protegida) {
      alert("Esta lista no se puede editar");
      return;
    }

    const nuevoNombre = lista.nombre;

    try {
      const respuesta = await manejarErrorYReintentar(
        async () => await fetch(
          `http://localhost:3000/api/${usuarioId}/listas/${listaId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ nombre: nuevoNombre }),
          }
        )
      );

      if (!respuesta.ok) {
        throw new Error("Error al actualizar el nombre de la lista");
      }

      console.log("Nombre de la lista actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar el nombre de la lista:", error);
    }
  };

  const manejarBlurNombre = (listaId) => {
    const nuevasListas = listasDeLibros.map((lista) => {
      if (lista._id === listaId) {
        return { ...lista, editable: false };
      }
      return lista;
    });
    setListasDeLibros(nuevasListas);
    actualizarNombreLista(listaId);
  };

  const manejarClickLista = async (listaId) => {
    console.log(`ID de la lista seleccionada: ${listaId}`);

    const listaSeleccionada = listasDeLibros.find(
      (lista) => lista._id === listaId
    );
    if (listaSeleccionada) {
      setNombreListaSeleccionada(listaSeleccionada.nombre);
    }

    setIndiceSeleccionado(listaId);
    console.log(`Índice de lista seleccionado cambiado a: ${listaId}`);

    localStorage.setItem("indiceSeleccionado", listaId);

    try {
      const url = `http://localhost:3000/api/obtener-libros/${usuarioId}/${listaId}`;
      console.log(`URL de la solicitud: ${url}`);

      const respuesta = await manejarErrorYReintentar(
        async () => await fetch(url)
      );

      console.log("Respuesta del fetch:", respuesta);

      if (!respuesta.ok) {
        console.error(
          "Error en la respuesta del servidor:",
          respuesta.statusText
        );
        throw new Error("Error al obtener los libros de la lista");
      }

      const data = await respuesta.json();
      console.log("Datos de libros obtenidos:", data);

      setLibrosDeLista(data);
    } catch (error) {
      console.error("Error al obtener los libros de la lista:", error);
    }
  };

  const manejarEditarClick = (listaId) => {
    const lista = listasDeLibros.find((lista) => lista._id === listaId);
    if (lista.protegida) {
      alert("Esta lista no se puede editar");
      return;
    }

    const nuevasListas = listasDeLibros.map((lista) => {
      if (lista._id === listaId) {
        return { ...lista, editable: true };
      }
      return lista;
    });
    setListasDeLibros(nuevasListas);
  };

  return (
    <>
      <div className={listas["div-cabecera"]}>
        <div className={listas["h1-listas"]}>
          <Link to="/perfil">
            <span
              className={`${estilos["material-icons-outlined"]} ${resena["flecha-resena"]} ${listas["flecha"]}`}
              style={{ color: "#252627", fontSize: "52px" }}
            >
              arrow_back
            </span>
          </Link>
          <h1 className={listas["titulo"]}>Tus listas</h1>
        </div>
        <div className={listas["div-iconos-mas"]}>
          <div className={listas["circulo-contenedor"]} onClick={agregarLista}>
            <div className={listas["circulo"]}>
              <span className={listas["mas"]}>+</span>
            </div>
          </div>
          <div className={listas["iconos-lista"]}>
            {listasDeLibros.map((lista) => (
              <div
                key={lista._id}
                className={listas["titulo-lista"]}
                onClick={() => manejarClickLista(lista._id)}
              >
                <img
                  src={lista.icono}
                  alt="icono libro"
                  style={{ width: "100px", marginLeft: "20px" }}
                />
                {indiceSeleccionado === lista._id &&
                  lista.nombre !== "Me gusta" && (
                    <span
                      className="material-symbols-outlined"
                      style={{
                        position: "absolute",
                        cursor: "pointer",
                        fontSize: "24px",
                        right: "20px",
                        top: "-50px",
                        color: "#22222",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        eliminarLista(lista._id);
                      }}
                    >
                      delete
                    </span>
                  )}
                {indiceSeleccionado === lista._id &&
                  lista.nombre !== "Me gusta" && (
                    <span
                      className="material-symbols-outlined"
                      style={{
                        position: "absolute",
                        cursor: "pointer",
                        fontSize: "24px",
                        right: "50px",
                        top: "-50px",
                        color: "#22222",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        manejarEditarClick(lista._id);
                      }}
                    >
                      edit
                    </span>
                  )}
                {lista.editable ? (
                  <input
                    type="text"
                    value={lista.nombre}
                    onChange={(e) => manejarEditarNombre(e, lista._id)}
                    onBlur={() => manejarBlurNombre(lista._id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        manejarBlurNombre(lista._id);
                      }
                    }}
                    autoFocus
                    style={{
                      color: "#000000",
                      backgroundColor: "transparent",
                      border: "none",
                      fontSize: "16px",
                      width: "120px",
                      marginLeft: "50px",
                    }}
                  />
                ) : (
                  <p className={listas["parrafos"]}>{lista.nombre}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={listas["seccion-libros"]}>
        <h1 className={listas["titulo-seccion-libros"]}>
          {nombreListaSeleccionada}
        </h1>
        <div className={principal["seccion-libros-grid"]}>
          {librosDeLista.map((libro) => (
            <div key={libro._id} className={principal["item-libro"]}>
              <ItemLibro
                libro={libro}
                mostrarDiv={true}
                colorTextoTitulo="#f4e5e0"
                colorTextoGenero="#252627"
                colorFondo="#f4e5e0"
                colorIcono="#f4e5e0"
                context="listas"
                indiceSeleccionado={indiceSeleccionado}
              />
            </div>
          ))}
        </div>
      </div>
      {popupVisible && (
        <ComponentePopupListas
          libro={libroSeleccionado}
          onClose={cerrarPopupLista}
          listas={listasDeLibros} 
        />
      )}
    </>
  );
}

export default ComponenteListas;
