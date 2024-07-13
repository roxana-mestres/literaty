import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import principal from "../../estilos/PaginaPrincipal.module.css";
import heartFillBlack from "../../assets/heart-fill-black.svg";
import heartBorderBlack from "../../assets/heart-border-black.svg";
import heartFillLight from "../../assets/heart-fill-light.svg";
import heartBorderLight from "../../assets/heart-border-light.svg";

function ComponenteItemLibro({
  libro,
  onEliminar,
  onBookmarkClick,
  favoritos,
  handleHeartClick,
  onClick,
  context,
  ...props
}) {
  const navegar = useNavigate();

  function obtenerIdLibro(libro) {
    return libro._id || libro.id;
  }

  const esFavoritos =
    Array.isArray(favoritos) && favoritos.includes(obtenerIdLibro(libro));

  const estiloTextoTitulo = {
    color: props.colorTextoTitulo,
  };

  const estiloGenero = {
    color: props.colorTextoGenero,
    backgroundColor: props.colorFondo,
  };

  const estiloIcono = {
    color: props.colorIcono,
    fontSize: "24px",
  };

  const estiloTextoAutor = {
    color: props.colorIcono,
  };

  const autores = Array.isArray(libro?.authors) ? libro.authors.join(", ") : "";
  const titulo = libro?.title || "";

  const numeroEstrellas =
    typeof libro?.averageRating === "number" && !isNaN(libro?.averageRating)
      ? Math.round(libro.averageRating)
      : null;

  const tituloCortado =
    titulo.length > 25 ? titulo.slice(0, 25) + "..." : titulo;
  const autoresCortados =
    autores.length > 25 ? autores.slice(0, 25) + "..." : autores;

  const handleEliminar = () => {
    if (onEliminar && libro.id) {
      onEliminar(libro.id);
    }
  };

  const handlePortadaClick = () => {
    navegar("/resena", { state: { libro } });
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick(libro);
    }
  };

  const handleClickCorazon = (e) => {
  e.stopPropagation();
  const libroId = obtenerIdLibro(libro);
  handleHeartClick(libroId);
};

  const iconoCorazon =
    context === "perfil"
      ? esFavoritos
        ? heartFillBlack
        : heartBorderBlack
      : esFavoritos
      ? heartFillLight
      : heartBorderLight;

  return (
    <div className={`${principal["div-libro-notas"]} ${props.className}`}>
      <div
        className={principal["portada-libro"]}
        style={{
          backgroundImage: `url(${libro.image})`,
          cursor: "pointer",
        }}
        onClick={handlePortadaClick}
      ></div>
      <div className={principal["datos-libro-notas"]}>
        <p style={estiloTextoTitulo}>{tituloCortado}</p>
        <p style={estiloTextoAutor}>{autoresCortados}</p>
        <p className={principal["genero-libro-notas"]} style={estiloGenero}>
          {libro.mainCategory}
        </p>
        <div className={principal["icono-estrella"]}>
          {numeroEstrellas === null ? (
            <p>Sin puntuación</p>
          ) : (
            Array.from({ length: numeroEstrellas }, (_, index) => (
              <p key={index}>⭐</p>
            ))
          )}
        </div>
      </div>
      {props.mostrarDiv && (
        <div className={principal["iconos-libros-notas"]}>
          <img
            src={iconoCorazon}
            alt="favorite icon"
            style={{ ...estiloIcono, fontSize: "5px", cursor: "pointer" }}
            onClick={handleClickCorazon}
            className={principal["icono-corazon"]}
          />
          <span
            className="material-symbols-outlined"
            style={{ ...estiloIcono, cursor: "pointer" }}
            onClick={handleBookmarkClick}
          >
            bookmark
          </span>
          <span
            className="material-symbols-outlined"
            style={{ ...estiloIcono, cursor: "pointer" }}
            onClick={handleEliminar}
          >
            delete
          </span>
        </div>
      )}
    </div>
  );
}

ComponenteItemLibro.propTypes = {
  className: PropTypes.string,
  mostrarDiv: PropTypes.bool,
  colorTextoTitulo: PropTypes.string,
  colorTextoGenero: PropTypes.string,
  colorFondo: PropTypes.string,
  colorIcono: PropTypes.string,
  libro: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    authors: PropTypes.arrayOf(PropTypes.string),
    mainCategory: PropTypes.string,
    averageRating: PropTypes.number,
    image: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  favoritos: PropTypes.arrayOf(PropTypes.string),
  onEliminar: PropTypes.func.isRequired,
  onBookmarkClick: PropTypes.func.isRequired,
  context: PropTypes.oneOf(["perfil", "listas"]).isRequired,
};

export default ComponenteItemLibro;
