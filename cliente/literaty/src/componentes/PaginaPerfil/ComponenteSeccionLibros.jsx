import PropTypes from "prop-types";
import ComponenteItemLibro from "./ComponenteItemLibro";
import principal from "../../estilos/PaginaPrincipal.module.css";

function ComponenteSeccionLibros({ librosGoogleBooks, onEliminarLibro, onBookmarkClick }) {
  console.log("libros google book:", librosGoogleBooks)
  const librosConImagen = librosGoogleBooks.filter((libro) => {
    const volumeInfo = libro.volumeInfo || {};
    
    return volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail;
  });

  return (
    <div className={principal["seccion-libros-grid"]}>
      {librosConImagen.map((libro, index) => {
        const volumeInfo = libro.volumeInfo || {};
        return (
          <div key={`${libro.id}`} className={`${principal["item-libro"]}`}>
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
              onEliminar={onEliminarLibro}
              onBookmarkClick={onBookmarkClick}
            />
          </div>
        );
      })}
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
  onEliminarLibro: PropTypes.func.isRequired,
  onBookmarkClick: PropTypes.func.isRequired, 
};

export default ComponenteSeccionLibros;
