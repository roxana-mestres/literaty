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
  } = useListas();
  const { handleEliminarLibro } = useLibros();
  const location = useLocation();
  const navegar = useNavigate();
  const { libro, context, indiceSeleccionado } = location.state || {};

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

  const handleEliminarLocal = () => {
    const obtenerIdLibro = (libro) => libro._id || libro.id;
    const libroId = obtenerIdLibro(libro);
    if (!libroId) {
      console.error("Error: No se encontró el ID del libro.");
      return;
    }

    if (context === "perfil") {
      handleEliminarLibro(libroId);
      navegar("/perfil");
    } else if (context === "listas") {
      if (!indiceSeleccionado) {
        console.error("Error: No se ha seleccionado una lista actual.");
        return;
      }
      console.log(
        "Eliminando libro:",
        libroId,
        "de la lista:",
        indiceSeleccionado
      );
      eliminarLibroDeLista(indiceSeleccionado, libroId);
      navegar(`/listas`);
    } else {
      console.error("Error: Contexto no válido.");
    }
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
          } else if (icono === "delete") {
            handleEliminarLocal();
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
