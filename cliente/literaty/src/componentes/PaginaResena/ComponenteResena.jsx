import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import estilos from "../../estilos/Comunes.module.css";
import resena from "../../estilos/PaginaResena.module.css";
import ItemLibro from "../PaginaPerfil/ComponenteItemLibro";
import Popup from "../PaginaPerfil/ComponentePopup";
import Footer from "../PaginaPerfil/ComponenteFooter";

function ComponenteResena() {
  const [expandido, setExpandido] = useState(false);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const location = useLocation();
  const { libro } = location.state || {};

  if (!libro) {
    return <div>No se ha encontrado la información del libro.</div>;
  }

  const textoCompleto = libro?.description || "Descripción no disponible.";
  const limitePalabras = 100;
  const palabras = textoCompleto.split(" ");
  const textoResumido = palabras.slice(0, limitePalabras).join(" ");
  const mostrarLeerMas = palabras.length > limitePalabras;

  return (
    <>
      <div className={resena["div-flecha-itemlibro"]}>
        <Link to="/perfil">
          <span
            className={`${estilos["material-icons-outlined"]} ${resena["flecha-resena"]}`}
            style={{ color: "#252627", fontSize: "42px" }}
          >
            arrow_back
          </span>
        </Link>
        <ItemLibro className={resena["itemlibro"]} libro={libro} mostrarDiv={false} onEliminar={() => {}}/>
      </div>
      <div className={resena["textoresena"]}>
        <p>
          {expandido ? textoCompleto : textoResumido}
          {mostrarLeerMas && (
            <strong
              className={estilos.enlace}
              onClick={() => setExpandido(!expandido)}
              style={{ cursor: "pointer" }}
            >
              {expandido ? " ...Leer menos" : " ...Leer más"}
            </strong>
          )}
        </p>
      </div>
      <Footer
        iconos={["bookmark", "delete", "favorite"]}
        onIconClick={(icono) => {
          if (icono === "bookmark") {
            setMostrarPopup((prevMostrarPopup) => !prevMostrarPopup);
          }
        }}
      />
      {mostrarPopup && (
        <>
          <div
            className={resena["popup-fondo"]}
            onClick={() => setMostrarPopup(false)}
          />
          <div className={resena["popup"]}>
            <Popup contenido="resena" className={resena["popup"]} />
          </div>
        </>
      )}
    </>
  );
}

export default ComponenteResena;
