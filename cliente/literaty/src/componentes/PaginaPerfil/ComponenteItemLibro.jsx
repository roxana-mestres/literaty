import principal from "../../estilos/PaginaPrincipal.module.css";
import PropTypes from "prop-types";

function ItemLibro(props) {
  const { libro } = props;
  console.log(props)

  const estiloTextoTitulo = {
    color: props.colorTextoTitulo,
  };

  const estiloGenero = {
    color: props.colorTextoGenero,
    backgroundColor: props.colorFondo,
  };

  const estiloIcono = {
    color: props.colorIcono,
    fontSize: "35px",
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

  return (
    <div className={`${principal["div-libro-notas"]} ${props.className}`}>
      <div
        className={principal["portada-libro"]}
        style={{
          backgroundImage: `url(${libro.image})`,
        }}
      ></div>
      <div className={principal["datos-libro-notas"]}>
        <p style={estiloTextoTitulo}>{tituloCortado}</p>
        <p>{autoresCortados}</p>
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
          <span
            className="material-symbols-outlined"
            style={{ estiloIcono, cursor: "pointer" }}
          >
            favorite
          </span>
          <span
            className="material-symbols-outlined"
            style={{ estiloIcono, cursor: "pointer" }}
          >
            bookmark
          </span>
          <span
            className="material-symbols-outlined"
            style={{ estiloIcono, cursor: "pointer" }}
          >
            delete
          </span>
        </div>
      )}
    </div>
  );
}

ItemLibro.propTypes = {
  className: PropTypes.string,
  mostrarDiv: PropTypes.bool,
  colorTextoTitulo: PropTypes.string,
  colorTextoGenero: PropTypes.string,
  colorFondo: PropTypes.string,
  colorIcono: PropTypes.string,
  libro: PropTypes.shape({
    title: PropTypes.string,
    authors: PropTypes.arrayOf(PropTypes.string),
    mainCategory: PropTypes.string,
    averageRating: PropTypes.number,
    image: PropTypes.string,
  }),
};

export default ItemLibro;
