import ItemLibro from "./ComponenteItemLibro";
import principal from "../../estilos/PaginaPrincipal.module.css";
import PropTypes from "prop-types";

function SeccionLibros({ librosGoogleBooks }) {
  const librosConImagen = librosGoogleBooks.filter((libro) => {
    const volumeInfo = libro.volumeInfo;
    return volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail;
  });

  return (
    <div className={`${principal["seccion-libros-grid"]}`}>
      {librosConImagen.map((libro, index) => {
        const volumeInfo = libro.volumeInfo;
        return (
          <div key={index} className={principal["item-libro"]}>
            <ItemLibro
              libro={{
                title: volumeInfo.title,
                authors: volumeInfo.authors || [],
                mainCategory: volumeInfo.categories ? volumeInfo.categories[0] : "Unknown",
                averageRating: volumeInfo.averageRating,
                description: volumeInfo.description,
                image: volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : ""
              }}
              mostrarDiv={true}
            />
          </div>
        );
      })}
    </div>
  );
}

SeccionLibros.propTypes = {
  librosGoogleBooks: PropTypes.arrayOf(
    PropTypes.shape({
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

export default SeccionLibros;
