const jwt = require("jsonwebtoken");

const buscarLibros = async (peticion, respuesta) => {
  const termino = peticion.query.termino;
  const idioma = peticion.query.idioma || 'en';

  if (!termino) {
    return respuesta
      .status(400)
      .json({ message: "Se requiere un término de búsqueda" });
  }

  if (!['en', 'es'].includes(idioma)) {
    return respuesta
      .status(400)
      .json({ message: "Idioma no soportado. Use 'en' para inglés o 'es' para español." });
  }

  try {
    const respuestaFetch = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(termino)}&langRestrict=${idioma}`
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

    if (!token) {
      return respuesta.status(401).json({ message: "No hay token de autenticación" });
    }

    const data = jwt.verify(token, process.env.CLAVE);
    const usuarioId = data.id;

    if (!usuarioId) {
      return respuesta.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const categoriasPermitidas = [
      "Fiction",
      "General",
      "Self-Help",
      "Thrillers",
      "Historical",
      "Contemporary",
      "Epic",
      "Classics",
      "Women",
      "Biography & Autobiography",
      "Literary",
      "Psychology"
    ];

    const terminosDeBusqueda = [
      "bestseller",
      "top books",
      "best books",
      "most popular books",
      "award winning books",
      "top rated books",
      "editor's picks",
      "must read books",
      "all time favorites",
      "critically acclaimed books"
    ];

    const maxResultadosPorSolicitud = 40;
    const cantidadDeseada = 12;
    const maxIntentos = 5;

    let librosFiltrados = [];
    const librosUnicos = new Map();

    const buscarLibros = async (idioma, orderBy) => {
      const promesas = terminosDeBusqueda.map(async (termino) => {
        let intentos = 0;
        while (intentos < maxIntentos) {
          const indiceInicio = Math.floor(Math.random() * 500);
          intentos++;

          try {
            const respuestaFetch = await fetch(
              `https://www.googleapis.com/books/v1/volumes?q=${termino}&startIndex=${indiceInicio}&maxResults=${maxResultadosPorSolicitud}&orderBy=${orderBy}&langRestrict=${idioma}`
            );
            const data = await respuestaFetch.json();

            const nuevosLibros = (data.items || []).filter((libro) => {
              const volumenInfo = libro.volumeInfo || {};
              const categorias = volumenInfo.categories || [];
              const calificacionPromedio = volumenInfo.averageRating || 0;

              const tieneCategoriaPermitida = categorias.some(categoria => 
                categoriasPermitidas.includes(categoria)
              );

              return (
                categorias.length > 0 &&
                tieneCategoriaPermitida &&
                calificacionPromedio >= 3
              );
            });

            nuevosLibros.forEach((libro) => {
              if (!librosUnicos.has(libro.id)) {
                librosUnicos.set(libro.id, libro);
              }
            });

            if (librosUnicos.size >= cantidadDeseada) return;

          } catch (error) {
            console.error(`Error al obtener libros de Google Books para idioma ${idioma}:`, error);
          }
        }
      });

      await Promise.all(promesas);
    };

    await Promise.all([
      buscarLibros('en', 'relevance'),
      buscarLibros('es', 'relevance')
    ]);

    librosFiltrados = Array.from(librosUnicos.values()).slice(0, cantidadDeseada);

    respuesta.json(librosFiltrados);

  } catch (error) {
    console.error("Error al obtener libros librosControlador:", error);
    if (error.name === "JsonWebTokenError") {
      return respuesta.status(401).json({ mensaje: "Token inválido o expirado" });
    }
    respuesta.status(500).json({ mensaje: "Error al obtener libros libroControlador", error });
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
