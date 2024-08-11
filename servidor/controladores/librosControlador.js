const jwt = require("jsonwebtoken");

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
  try {
    const token = peticion.cookies.access_token;
    console.log("Token recibido librosControlador:", token);
    if (!token) {
      return respuesta
        .status(401)
        .json({ message: "No hay token de autenticación" });
    }

    const data = jwt.verify(token, process.env.CLAVE);
    const usuarioId = data.id;

    console.log("Datos del usuario librosControlador:", data);

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
    const idsVistos = new Set();

    const librosEliminados =
      librosEliminadosPorUsuario.get(usuarioId) || new Set();

    const generosExcluidos = new Set([
      "juvenile fiction",
      "juvenile nonfiction",
      "education",
      "children's stories",
      "animals",
    ]);

    while (librosFiltrados.length < cantidadDeseada && intentos < maxIntentos) {
      const indiceInicio = Math.floor(Math.random() * 500);
      intentos++;

      try {
        const respuestaFetch = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${indiceInicio}&maxResults=${maxResultadosPorSolicitud}&orderBy=relevance`
        );
        const data = await respuestaFetch.json();

        const nuevosLibros = (data.items || []).filter((libro) => {
          const volumenInfo = libro.volumeInfo || {};
          const categorias = volumenInfo.categories || [];
          const libroId = libro.id || "";
          const categoriasValidas = categorias.every(
            (categoria) => !generosExcluidos.has(categoria.toLowerCase())
          );
          return (
            categoriasValidas &&
            !librosEliminados.has(libroId) &&
            categorias.length > 0 &&
            categorias[0] !== "Unknown" &&
            volumenInfo.averageRating &&
            !idsVistos.has(libroId)
          );
        });

        nuevosLibros.forEach((libro) => idsVistos.add(libro.id));
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
    console.error("Error al obtener libros librosControlador:", error);
    if (error.name === "JsonWebTokenError") {
      console.error("Error de JWT:", error.message);
      return respuesta
        .status(401)
        .json({ mensaje: "Token inválido o expirado" });
    }
    respuesta
      .status(500)
      .json({ mensaje: "Error al obtener libros libroControlador", error });
  }
};

const librosEliminadosPorUsuario = new Map();

const eliminarLibro = async (peticion, respuesta) => {
  const libroId = peticion.params.id;

  if (!libroId) {
    return respuesta.status(400).json({ message: "Faltan parámetros" });
  }

  try {
    const token = peticion.cookies.access_token;
    if (!token) {
      return respuesta
        .status(401)
        .json({ message: "No hay token de autenticación" });
    }

    const data = jwt.verify(token, process.env.CLAVE);
    const usuarioId = data.id;

    if (!usuarioId) {
      return respuesta.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!librosEliminadosPorUsuario.has(usuarioId)) {
      librosEliminadosPorUsuario.set(usuarioId, new Set());
    }

    librosEliminadosPorUsuario.get(usuarioId).add(libroId);

    respuesta.status(204).send();
  } catch (error) {
    console.error("Error al eliminar el libro:", error);
    respuesta
      .status(500)
      .json({ message: "Error al eliminar el libro", error });
  }
};

module.exports = { buscarLibros, obtenerLibros, eliminarLibro };
