import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useListas } from "../../contextos/contextoListas";
import { useLibros } from "../../contextos/contextoLibros";
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
    eliminarLibroDeLista,
    handleHeartClick,
  } = useListas();
  const { handleEliminarLibro } = useLibros();
  const location = useLocation();
  const navigate = useNavigate();
  const { libro, context, indiceSeleccionado } = location.state || {};

  if (!libro) {
    return <div>No se ha encontrado la información del libro.</div>;
  }

  // Función para remover etiquetas HTML
  function eliminarEtiquetasHTML(texto) {
    return texto.replace(/<\/?[^>]+(>|$)/g, "");
  }

  const textoCompleto = eliminarEtiquetasHTML(libro?.description || "Descripción no disponible.");
  const limitePalabras = 100;
  const palabras = textoCompleto.split(" ");
  const textoResumido = palabras.slice(0, limitePalabras).join(" ");
  const mostrarLeerMas = palabras.length > limitePalabras;

  const handleBookmarkClick = () => {
    abrirPopupLista(libro);
  };

  const handleEliminarLocal = () => {
    const obtenerIdLibro = (libro) => libro._id || libro.id;
    const libroId = obtenerIdLibro(libro);
    if (!libroId) {
      console.error("Error: No se encontró el ID del libro.");
      return;
    }

    if (context === "perfil") {
      handleEliminarLibro(libroId);
      navigate("/perfil");
    } else if (context === "listas") {
      if (!indiceSeleccionado) {
        console.error("Error: No se ha seleccionado una lista actual.");
        return;
      }
      eliminarLibroDeLista(indiceSeleccionado, libroId);
      navigate(`/listas`, { state: { indiceSeleccionado } });
    } else {
      console.error("Error: Contexto no válido.");
    }
  };

  const handleFavoriteClick = () => {
    const obtenerIdLibro = (libro) => libro._id || libro.id;
    const libroId = obtenerIdLibro(libro);
    handleHeartClick(libroId);
  };

  const handleArrowBackClick = () => {
    if (context === "listas" && indiceSeleccionado !== undefined) {
      navigate("/listas", { state: { indiceSeleccionado } });
    } else {
      navigate("/perfil");
    }
  };

  return (
    <>
      <div className={resena["div-flecha-itemlibro"]}>
        <span
          className={`${estilos["material-icons-outlined"]} ${resena["flecha-resena"]}`}
          style={{ color: "#252627", fontSize: "42px", cursor: "pointer" }}
          onClick={handleArrowBackClick}
        >
          arrow_back
        </span>
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
          } else if (icono === "delete") {
            handleEliminarLocal();
          } else if (icono === "favorite") {
            handleFavoriteClick();
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
