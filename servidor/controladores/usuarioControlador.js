const Usuario = require("../modelos/Usuario");

const obtenerIdDelUsuarioPorEmail = async (email) => {
  try {
    const usuario = await Usuario.findOne({ email }).select("_id");
    return usuario ? usuario._id : null;
  } catch (error) {
    throw new Error("Error al obtener ID del usuario por email");
  }
};

const crearLista = async (peticion, respuesta) => {
  const { id } = peticion.params;
  const { nombre } = peticion.body;

  console.log('ID del usuario:', id);
  console.log('Nombre de la lista:', nombre);

  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      console.log('Usuario no encontrado');
      return respuesta.status(404).json({ message: "Usuario no encontrado" });
    }

    const nuevaLista = {
      nombre,
      icono: null,
      editable: false,
      libros: []
    };

    usuario.listas.push(nuevaLista);
    await usuario.save();

    const listaCreada = usuario.listas[usuario.listas.length - 1];

    console.log('Lista creada con éxito:', nuevaLista);
    respuesta.status(201).json(listaCreada);
  } catch (error) {
    console.error('Error al crear la lista:', error);
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
      console.log('Usuario no encontrado');
      return respuesta.status(404).json({ message: "Usuario no encontrado" });
    }

    const lista = usuario.listas.id(listaId);
    if (!lista) {
      console.log('Lista no encontrada');
      return respuesta.status(404).json({ message: "Lista no encontrada" });
    }

    if (lista.libros.includes(libroId)) {
      console.log('El libro ya está en la lista');
      return respuesta.status(200).json(lista);
    }

    lista.libros.push(libroId);
    await usuario.save();

    console.log('Libro agregado a la lista:', lista);
    respuesta.status(200).json(lista);
  } catch (error) {
    console.error('Error al agregar el libro a la lista:', error);
    respuesta.status(500).json({ message: "Error al agregar el libro a la lista", error });
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
      console.log('Usuario no encontrado');
      return respuesta.status(404).json({ message: "Usuario no encontrado" });
    }

    const resultado = await Usuario.updateOne(
      { _id: usuarioId, 'listas._id': listaId },
      { $pull: { listas: { _id: listaId } } }
    );

    if (resultado.modifiedCount === 0) {
      console.log('Lista no encontrada');
      return respuesta.status(404).json({ message: "Lista no encontrada" });
    }

    console.log('Lista eliminada con éxito');
    respuesta.status(200).json({ message: "Lista eliminada correctamente" });
  } catch (error) {
    console.error('Error al eliminar la lista:', error);
    respuesta.status(500).json({ message: "Error al eliminar la lista", error });
  }
};

const eliminarLibroDeLista = async (peticion, respuesta) => {
  const { usuarioId, listaId, libroId } = peticion.params;

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

module.exports = {
  obtenerIdDelUsuarioPorEmail,
  crearLista,
  agregarLibroALista,
  obtenerListas,
  eliminarLista,
  eliminarLibroDeLista,
};