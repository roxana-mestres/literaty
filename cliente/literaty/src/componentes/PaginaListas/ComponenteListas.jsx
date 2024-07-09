import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import estilos from "../../estilos/Comunes.module.css";
import resena from "../../estilos/PaginaResena.module.css";
import listas from "../../estilos/estilosListas.module.css";
import principal from "../../estilos/PaginaPrincipal.module.css";
import ItemLibro from "../PaginaPerfil/ComponenteItemLibro";
import BotonSubir from "../../componentes/PaginaPerfil/ComponenteBotonSubir";

const iconosLibros = [
  "/src/assets/libro-1.svg",
  "/src/assets/libro-2.svg",
  "/src/assets/libro-3.svg",
  "/src/assets/libro-4.svg",
  "/src/assets/libro-5.svg",
  "/src/assets/libro-6.svg",
];
const usuarioId = "668bafacde874b5e8bcbe4a3";

function ComponenteListas() {
  const [listasDeLibros, setListasDeLibros] = useState([]);
  const [libros, setLibros] = useState([
    {
      id: "123",
      titulo: "Crimen y Castigo",
      autor: "Fiodor Dostoievski",
      genero: "Ficción literaria",
      puntuacion: "⭐⭐⭐⭐⭐",
    },
    // más libros
  ]);
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(null);

  useEffect(() => {
    const fetchListas = async () => {
      const usuarioId = "668bafacde874b5e8bcbe4a3";
      try {
        console.log(`Fetching listas for usuarioId: ${usuarioId}`);
        const respuesta = await fetch(
          `http://localhost:3000/api/listas/${usuarioId}`
        );
        console.log("Respuesta fetch:", respuesta);
        if (!respuesta.ok) {
          throw new Error("Error al obtener las listas");
        }
        let data = await respuesta.json();
        console.log("Datos obtenidos:", data);

        data = data.map((lista, index) => ({
          ...lista,
          icono: lista.icono || iconosLibros[index % iconosLibros.length],
        }));

        setListasDeLibros(data);
      } catch (error) {
        console.error("Error al obtener las listas:", error);
      }
    };

    if (usuarioId) {
      fetchListas();
    }
  }, [usuarioId]);

  const agregarLista = async () => {
    try {
      const usuarioId = "668bafacde874b5e8bcbe4a3";
      const nuevoIndice = listasDeLibros.length % iconosLibros.length;
      const nuevaLista = {
        nombre: `Nueva Lista ${listasDeLibros.length + 1}`,
        icono: iconosLibros[nuevoIndice],
        editable: false,
        libros: [],
        protegida: false,
      };

      console.log("Enviando solicitud para crear lista con datos:", nuevaLista);

      const respuesta = await fetch(
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

  const eliminarLista = async (index) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta lista?")) {
      const listaId = listasDeLibros[index]._id;
      const usuarioId = "668bafacde874b5e8bcbe4a3";
      console.log("ID de la lista a eliminar:", listaId);
      try {
        const respuesta = await fetch(
          `http://localhost:3000/api/${usuarioId}/listas/${listaId}`,
          {
            method: "DELETE",
          }
        );

        console.log("Respuesta de la solicitud de eliminación:", respuesta);

        if (respuesta.ok) {
          const nuevasListas = listasDeLibros.filter((_, i) => i !== index);
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

  const manejarEditarNombre = (e, index) => {
    const nuevoNombre = e.target.value;
    const nuevasListas = listasDeLibros.map((lista, i) => {
      if (i === index) {
        return { ...lista, nombre: nuevoNombre };
      }
      return lista;
    });
    setListasDeLibros(nuevasListas);
  };

  const actualizarNombreLista = async (index) => {
    const lista = listasDeLibros[index];
    if (lista.protegida) {
      alert("Esta lista no se puede editar");
      return;
    }

    const listaId = lista._id;
    const nuevoNombre = lista.nombre;

    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/${usuarioId}/listas/${listaId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nombre: nuevoNombre }),
        }
      );

      if (!respuesta.ok) {
        throw new Error("Error al actualizar el nombre de la lista");
      }

      console.log("Nombre de la lista actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar el nombre de la lista:", error);
    }
  };

  const manejarBlurNombre = (index) => {
    const nuevasListas = listasDeLibros.map((lista, i) => {
      if (i === index) {
        return { ...lista, editable: false };
      }
      return lista;
    });
    setListasDeLibros(nuevasListas);
    actualizarNombreLista(index);
  };

  const manejarClickLista = (index) => {
    setIndiceSeleccionado(index);
  };

  const manejarEditarClick = (index) => {
    const lista = listasDeLibros[index];
    if (lista.protegida) {
      alert("Esta lista no se puede editar");
      return;
    }

    const nuevasListas = listasDeLibros.map((lista, i) => {
      if (i === index) {
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
            {listasDeLibros.map((lista, index) => (
              <div
                key={index}
                className={listas["titulo-lista"]}
                onClick={() => manejarClickLista(index)}
              >
                <img
                  src={lista.icono}
                  alt="icono libro"
                  style={{ width: "100px", marginLeft: "20px" }}
                />
                {indiceSeleccionado === index &&
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
                        eliminarLista(index);
                      }}
                    >
                      delete
                    </span>
                  )}
                {indiceSeleccionado === index &&
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
                        manejarEditarClick(index);
                      }}
                    >
                      edit
                    </span>
                  )}
                {lista.editable ? (
                  <input
                    type="text"
                    value={lista.nombre}
                    onChange={(e) => manejarEditarNombre(e, index)}
                    onBlur={() => manejarBlurNombre(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        manejarBlurNombre(index);
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
          Libros que me gustan
        </h1>
        <div className={principal["seccion-libros-grid"]}>
          {libros.map((libro, index) => (
            <div key={index} className={principal["item-libro"]}>
              <ItemLibro
                libro={libro}
                mostrarDiv={true}
                onEliminar={() => {}}
                onBookmarkClick={() => {}}
                colorTextoTitulo="#f4e5e0"
                colorTextoGenero="#252627"
                colorFondo="#f4e5e0"
                colorIcono="#f4e5e0"
              />
            </div>
          ))}
        </div>
      </div>
      <BotonSubir colorBoton="#f4e5e0" />
    </>
  );
}

export default ComponenteListas;
