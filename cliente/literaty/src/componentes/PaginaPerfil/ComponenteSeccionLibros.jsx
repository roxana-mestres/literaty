import { useListas } from "../../contextos/contextoListas";
import PropTypes from "prop-types";
import ComponenteItemLibro from "./ComponenteItemLibro";
import ComponentePopupListas from "../../componentes/PaginaListas/ComponentePopupListas";
import principal from "../../estilos/PaginaPrincipal.module.css";

function ComponenteSeccionLibros({ librosGoogleBooks }) {
  const {
    cerrarPopupLista,
    popupVisible,
    libroSeleccionado,
  } = useListas();
  const librosConImagen = librosGoogleBooks.filter((libro) => {
    const volumeInfo = libro.volumeInfo || {};
    return volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail;
  });

  return (
    <div className={principal["seccion-libros-grid"]}>
      {librosConImagen.map((libro) => {
        const volumeInfo = libro.volumeInfo || {};
        return (
          <div key={`${libro.id}`} className={principal["item-libro"]}>
            <ComponenteItemLibro
              libro={{
                id: libro.id || "",
                title: volumeInfo.title,
                authors: volumeInfo.authors || [],
                mainCategory: volumeInfo.categories
                  ? volumeInfo.categories[0]
                  : "Unknown",
                averageRating: volumeInfo.averageRating,
                description: volumeInfo.description,
                image: volumeInfo.imageLinks
                  ? volumeInfo.imageLinks.thumbnail
                  : "",
              }}
              mostrarDiv={true}
              context="perfil"
            />
          </div>
        );
      })}

      {popupVisible && libroSeleccionado && (
        <ComponentePopupListas libro={libroSeleccionado} onClose={cerrarPopupLista} />
      )}
    </div>
  );
}

ComponenteSeccionLibros.propTypes = {
  librosGoogleBooks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      volumeInfo: PropTypes.shape({
        title: PropTypes.string,
        authors: PropTypes.arrayOf(PropTypes.string),
        categories: PropTypes.arrayOf(PropTypes.string),
        averageRating: PropTypes.number,
        description: PropTypes.string,
        imageLinks: PropTypes.shape({
          thumbnail: PropTypes.string,
        }),
      }),
    })
  ).isRequired,
};

export default ComponenteSeccionLibros;
