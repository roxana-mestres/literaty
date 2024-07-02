const { obtenerIdDelUsuarioPorEmail } = require("./usuarioControlador");

const buscarLibros = async (peticion, respuesta) => {
  const termino = peticion.query.termino;
  if (!termino) {
    return respuesta
      .status(400)
      .json({ message: "Se requiere un término de búsqueda" });
  }

  try {
    const respuestaFetch = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        termino
      )}`
    );
    const data = await respuestaFetch.json();
    respuesta.json(data.items || []);
  } catch (error) {
    respuesta.status(500).json({ message: "Error al buscar libros", error });
  }
};

const obtenerLibros = async (peticion, respuesta) => {
  const emailUsuario = peticion.body.email;
  console.log("emailUsuario desde petición:", emailUsuario);

  try {
    const usuarioId = await obtenerIdDelUsuarioPorEmail(emailUsuario);
    console.log("usuarioId obtenido:", usuarioId);

    if (!usuarioId) {
      return respuesta.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const terminosDeBusqueda = [
      "bestseller",
      "popular",
      "new releases",
      "award winning",
      "top rated",
      "classic literature",
      "must read",
      "diverse books",
      "library picks",
      "books of the month",
      "reading list",
    ];

    const query =
      terminosDeBusqueda[Math.floor(Math.random() * terminosDeBusqueda.length)];
    const maxResultadosPorSolicitud = 30;
    const cantidadDeseada = 12;
    const maxIntentos = 5;

    let librosFiltrados = [];
    let intentos = 0;
    const librosUsados = new Set();

    while (librosFiltrados.length < cantidadDeseada && intentos < maxIntentos) {
      const indiceInicio = Math.floor(Math.random() * 1000);
      intentos++;

      try {
        const respuestaFetch = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${indiceInicio}&maxResults=${maxResultadosPorSolicitud}&orderBy=relevance`
        );
        const data = await respuestaFetch.json();

        const nuevosLibros = (data.items || []).filter((libro) => {
          const volumenInfo = libro.volumeInfo || {};
          const categorias = volumenInfo.categories || [];
          return (
            categorias.length > 0 &&
            categorias[0] !== "Unknown" &&
            volumenInfo.averageRating &&
            !librosUsados.has(libro.id)
          );
        });

        nuevosLibros.forEach((libro) => librosUsados.add(libro.id));
        librosFiltrados = librosFiltrados.concat(nuevosLibros);

        if (librosFiltrados.length > cantidadDeseada) {
          librosFiltrados = librosFiltrados.slice(0, cantidadDeseada);
        }
      } catch (error) {
        console.error("Error al obtener libros de Google Books:", error);
      }
    }

    respuesta.json(librosFiltrados);
  } catch (error) {
    console.error("Error al obtener libros por preferencias:", error);
    respuesta
      .status(500)
      .json({ mensaje: "Error al obtener libros por preferencias", error });
  }
};

module.exports = { buscarLibros, obtenerLibros };
