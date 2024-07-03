import { Link } from "react-router-dom";
import estilos from "../../estilos/Comunes.module.css";
import resena from "../../estilos/PaginaResena.module.css";
import listas from "../../estilos/estilosListas.module.css";
import principal from "../../estilos/PaginaPrincipal.module.css";
import ItemLibro from "../PaginaPerfil/ComponenteItemLibro";
import BotonSubir from "../../componentes/PaginaPerfil/ComponenteBotonSubir";


function ComponenteListas() {
  const libros = [
    {
      titulo: "Crimen y Castigo",
      autor: "Fiodor Dostoievski",
      genero: "Ficción literaria",
      puntuacion: "⭐⭐⭐⭐⭐",
    },
    {
      titulo: "Crimen y Castigo",
      autor: "Fiodor Dostoievski",
      genero: "Ficción literaria",
      puntuacion: "⭐⭐⭐⭐⭐",
    },
    {
      titulo: "Crimen y Castigo",
      autor: "Fiodor Dostoievski",
      genero: "Ficción literaria",
      puntuacion: "⭐⭐⭐⭐⭐",
    },
    {
      titulo: "Crimen y Castigo",
      autor: "Fiodor Dostoievski",
      genero: "Ficción literaria",
      puntuacion: "⭐⭐⭐⭐⭐",
    },
    {
      titulo: "Crimen y Castigo",
      autor: "Fiodor Dostoievski",
      genero: "Ficción literaria",
      puntuacion: "⭐⭐⭐⭐⭐",
    },
    {
      titulo: "Crimen y Castigo",
      autor: "Fiodor Dostoievski",
      genero: "Ficción literaria",
      puntuacion: "⭐⭐⭐⭐⭐",
    },
    {
      titulo: "Crimen y Castigo",
      autor: "Fiodor Dostoievski",
      genero: "Ficción literaria",
      puntuacion: "⭐⭐⭐⭐⭐",
    },
    {
      titulo: "Crimen y Castigo",
      autor: "Fiodor Dostoievski",
      genero: "Ficción literaria",
      puntuacion: "⭐⭐⭐⭐⭐",
    },
    {
      titulo: "Crimen y Castigo",
      autor: "Fiodor Dostoievski",
      genero: "Ficción literaria",
      puntuacion: "⭐⭐⭐⭐⭐",
    },
    // ... más libros
  ];

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
          <div className={listas["circulo-contenedor"]}>
            <div className={listas["circulo"]}>
              <span className={listas["mas"]}>+</span>
            </div>
          </div>
          <div className={listas["iconos-lista"]}>
            <div className={listas["titulo-lista"]}>
              <img
                src="/src/assets/libro-1.svg"
                alt="icono libro"
                style={{ width: "100px", marginLeft: "20px" }}
              ></img>
              <p className={listas["parrafos"]}>Me gustan</p>
            </div>
            <div className={listas["titulo-lista"]}>
              <img
                src="/src/assets/libro-4.svg"
                alt="icono libro"
                style={{ width: "100px", marginLeft: "20px" }}
              ></img>
              <p className={listas["parrafos"]}>Libros por comprar</p>
            </div>
            <div className={listas["titulo-lista"]}>
              <img
                src="/src/assets/libro-2.svg"
                alt="icono libro"
                style={{ width: "100px", marginLeft: "20px" }}
              ></img>
              <p className={listas["parrafos"]}>Libros por releer</p>
            </div>
            <div className={listas["titulo-lista"]}>
              <img
                src="/src/assets/libro-3.svg"
                alt="icono libro"
                style={{ width: "100px", marginLeft: "20px" }}
              ></img>
              <p className={listas["parrafos"]}>Libros por leer</p>
            </div>
          </div>
        </div>
      </div>
      <div className={listas["seccion-libros"]}>
        <h1 className={listas["titulo-seccion-libros"]}>
          Libros que me gustan
        </h1>
        <div className={`${principal["seccion-libros-grid"]}`}>
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
