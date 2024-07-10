const Usuario = require("../modelos/Usuario");
const Libro = require("../modelos/Libro");

const crearLista = async (peticion, respuesta) => {
  const { usuarioId } = peticion.params;
  const { nombre } = peticion.body;

  console.log("ID del usuario:", usuarioId);
  console.log("Nombre de la lista:", nombre);

  try {
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      console.log("Usuario no encontrado");
      return respuesta.status(404).json({ message: "Usuario no encontrado" });
    }

    const nuevaLista = {
      nombre,
      icono: null,
      editable: false,
      libros: [],
    };

    usuario.listas.push(nuevaLista);
    await usuario.save();

    const listaCreada = usuario.listas[usuario.listas.length - 1];

    console.log("Lista creada con éxito:", nuevaLista);
    respuesta.status(201).json(listaCreada);
  } catch (error) {
    console.error("Error al crear la lista:", error);
    respuesta.status(500).json({ message: "Error al crear la lista", error });
  }
};

const agregarLibroALista = async (peticion, respuesta) => {
  const { listaId } = peticion.params;
  const { libroId, usuarioId } = peticion.body;

  console.log("Agregar libro a lista:", { listaId, libroId, usuarioId });

  try {
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      console.log("Usuario no encontrado");
      return respuesta.status(404).json({ message: "Usuario no encontrado" });
    }

    const lista = usuario.listas.id(listaId);
    if (!lista) {
      console.log("Lista no encontrada");
      return respuesta.status(404).json({ message: "Lista no encontrada" });
    }

    let libro = await Libro.findById(libroId);

    if (!libro) {
      const libroDetalles = await obtenerDetallesDelLibroDesdeGoogle(libroId);
      libro = new Libro(libroDetalles);
      await libro.save();
    }

    if (lista.libros.includes(libroId)) {
      console.log("El libro ya está en la lista");
      return respuesta.status(200).json({ lista, libro });
    }

    lista.libros.push(libroId);
    await usuario.save();

    console.log("Libro recuperado:", libro);

    respuesta.status(200).json({ lista, libro });
  } catch (error) {
    console.error("Error al agregar el libro a la lista:", error);
    respuesta
      .status(500)
      .json({ message: "Error al agregar el libro a la lista", error });
  }
};

const obtenerListas = async (peticion, respuesta) => {
  const { usuarioId } = peticion.params;
  console.log("ID del usuario para obtener listas:", usuarioId);

  try {
    const usuario = await Usuario.findById(usuarioId).select("listas");
    if (!usuario) {
      return respuesta.status(404).json({ message: "Usuario no encontrado" });
    }

    respuesta.json(usuario.listas);
  } catch (error) {
    console.error(error);
    respuesta.status(500).json({ mensaje: "Error al obtener las listas" });
  }
};

const eliminarLista = async (peticion, respuesta) => {
  const { usuarioId, listaId } = peticion.params;

  try {
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      console.log("Usuario no encontrado");
      return respuesta.status(404).json({ message: "Usuario no encontrado" });
    }

    const lista = usuario.listas.id(listaId);
    if (!lista) {
      return respuesta.status(404).json({ message: "Lista no encontrada" });
    }

    if (lista.protegida) {
      return respuesta
        .status(403)
        .json({ message: "No se puede eliminar una lista protegida" });
    }

    const resultado = await Usuario.updateOne(
      { _id: usuarioId, "listas._id": listaId },
      { $pull: { listas: { _id: listaId } } }
    );

    if (resultado.modifiedCount === 0) {
      console.log("Lista no encontrada");
      return respuesta.status(404).json({ message: "Lista no encontrada" });
    }

    console.log("Lista eliminada con éxito");
    respuesta.status(200).json({ message: "Lista eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la lista:", error);
    respuesta
      .status(500)
      .json({ message: "Error al eliminar la lista", error });
  }
};

const actualizarNombreLista = async (peticion, respuesta) => {
  const { usuarioId, listaId } = peticion.params;
  const { nombre } = peticion.body;

  try {
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return respuesta.status(404).json({ message: "Usuario no encontrado" });
    }

    const lista = usuario.listas.id(listaId);
    if (!lista) {
      return respuesta.status(404).json({ message: "Lista no encontrada" });
    }

    if (lista.protegida) {
      return respuesta
        .status(403)
        .json({ message: "No se puede editar una lista protegida" });
    }

    lista.nombre = nombre;
    await usuario.save();

    respuesta.status(200).json(lista);
  } catch (error) {
    console.error("Error al actualizar el nombre de la lista:", error);
    respuesta
      .status(500)
      .json({ message: "Error al actualizar el nombre de la lista", error });
  }
};

const eliminarLibroDeLista = async (peticion, respuesta) => {
  const { usuarioId, listaId, libroId } = peticion.params;

  console.log("ID Usuario:", usuarioId);
  console.log("ID Lista:", listaId);
  console.log("ID Libro:", libroId);

  try {
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return respuesta.status(404).json({ message: "Usuario no encontrado" });
    }

    const lista = usuario.listas.id(listaId);
    if (!lista) {
      return respuesta.status(404).json({ message: "Lista no encontrada" });
    }

    lista.libros.pull(libroId);
    await usuario.save();

    respuesta.status(200).json(lista);
  } catch (error) {
    respuesta
      .status(500)
      .json({ message: "Error al eliminar el libro de la lista", error });
  }
};

const obtenerDetallesDelLibroDesdeGoogle = async (libroId) => {
  const url = `https://www.googleapis.com/books/v1/volumes/${libroId}`; //
  const respuesta = await fetch(url);
  const data = await respuesta.json();

  return {
    _id: libroId,
    title: data.volumeInfo.title,
    authors: data.volumeInfo.authors || [],
    mainCategory: data.volumeInfo.categories
      ? data.volumeInfo.categories[0]
      : null,
    averageRating: data.volumeInfo.averageRating || null,
    image: data.volumeInfo.imageLinks
      ? data.volumeInfo.imageLinks.thumbnail
      : null,
    description: data.volumeInfo.description || "",
  };
};

const obtenerLibrosDeLista = async (peticion, respuesta) => {
  const { listaId, usuarioId } = peticion.params;

  console.log("Lista id en controlador:", listaId);
  console.log("Usuario id en controlador:", usuarioId);

  try {
    const usuario = await Usuario.findById(usuarioId).select("listas");
    if (!usuario) {
      return respuesta.status(404).json({ message: "Usuario no encontrado" });
    }

    const lista = usuario.listas.id(listaId);

    if (!lista) {
      return respuesta.status(404).json({ message: "Lista no encontrada" });
    }

    console.log("Lista encontrada:", lista);
    console.log("IDs de libros en la lista:", lista.libros);

    const librosConDetalles = await Promise.all(
      lista.libros.map(async (libroId) => {
        let libro = await Libro.findById(libroId);

        if (!libro) {
          libro = await obtenerDetallesDelLibroDesdeGoogle(libroId);
        }

        return libro;
      })
    );

    respuesta.status(200).json(librosConDetalles);
  } catch (error) {
    console.error("Error al obtener los libros de la lista:", error);
    respuesta.status(500).json({ message: "Error al obtener los libros de la lista", error });
  }
};

module.exports = {
  crearLista,
  agregarLibroALista,
  obtenerListas,
  eliminarLista,
  actualizarNombreLista,
  eliminarLibroDeLista,
  obtenerLibrosDeLista,
};
