import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useListas } from "../../contextos/contextoListas";
import estilos from "../../estilos/Comunes.module.css";
import resena from "../../estilos/PaginaResena.module.css";
import ItemLibro from "../PaginaPerfil/ComponenteItemLibro";
import Footer from "../PaginaPerfil/ComponenteFooter";
import PopupListas from "../PaginaListas/ComponentePopupListas";

function ComponenteResena() {
  const [expandido, setExpandido] = useState(false);
  const {
    abrirPopupLista,
    cerrarPopupLista,
    handleCambioCheckbox,
    handleGuardarEnListas,
    popupVisible,
    listasSeleccionadas,
    libroSeleccionado,
  } = useListas();
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

  const handleBookmarkClick = () => {
    abrirPopupLista(libro);
  };

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
        <ItemLibro
          className={resena["itemlibro"]}
          libro={libro}
          mostrarDiv={false}
          onEliminar={() => {}}
        />
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
            handleBookmarkClick();
          }
        }}
      />    
      {popupVisible && (
        <PopupListas
          libro={libroSeleccionado}
          onClose={cerrarPopupLista}
          listasSeleccionadas={listasSeleccionadas}
          onCheckboxChange={handleCambioCheckbox}
          onSave={handleGuardarEnListas}
        />
      )}
    </>
  );
}

export default ComponenteResena;
