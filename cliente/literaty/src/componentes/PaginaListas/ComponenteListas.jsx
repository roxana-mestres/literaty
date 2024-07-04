import React, { useState } from "react";
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

function ComponenteListas() {
  const [listasDeLibros, setListasDeLibros] = useState([
    {
      nombre: "Me gustan",
      icono: iconosLibros[0],
      editable: false,
    },
  ]);
  const [libros, setLibros] = useState([
    {
      titulo: "Crimen y Castigo",
      autor: "Fiodor Dostoievski",
      genero: "Ficción literaria",
      puntuacion: "⭐⭐⭐⭐⭐",
    },
    // más libros
  ]);
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(null);

  const agregarLista = () => {
    const nuevoIndice = listasDeLibros.length % iconosLibros.length;
    const nuevaLista = {
      nombre: `Nueva Lista ${listasDeLibros.length + 1}`,
      icono: iconosLibros[nuevoIndice],
      editable: true,
    };
    setListasDeLibros([...listasDeLibros, nuevaLista]);
  };

  const eliminarLista = (index) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta lista?")) {
      const nuevasListas = listasDeLibros.filter((_, i) => i !== index);
      setListasDeLibros(nuevasListas);
      setIndiceSeleccionado(null);
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

  const manejarClickLista = (index) => {
    setIndiceSeleccionado(index);
  };

  const manejarBlurNombre = (index) => {
    const nuevasListas = listasDeLibros.map((lista, i) => {
      if (i === index) {
        return { ...lista, editable: false };
      }
      return lista;
    });
    setListasDeLibros(nuevasListas);
  };

  const manejarEditarClick = (index) => {
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
                {indiceSeleccionado === index && (
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
                {indiceSeleccionado === index && (
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
                      width:"150px"
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
