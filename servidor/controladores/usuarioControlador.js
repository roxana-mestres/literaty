const Usuario = require("../modelos/Usuario");

const obtenerIdDelUsuarioPorEmail = async (email) => {
  try {
    const usuario = await Usuario.findOne({ email }).select("_id");
    return usuario ? usuario._id : null;
  } catch (error) {
    throw new Error("Error al obtener ID del usuario por email");
  }
};

const obtenerUsuario = async (peticion, respuesta) => {
  try {
    const { usuarioId } = peticion.params;
    console.log('Parámetros recibidos:', peticion.params); 
    const usuario = await Usuario.findById(usuarioId);
    console.log('Usuario encontrado:', usuario);

    if (!usuario) {
      return respuesta.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    respuesta.json(usuario);
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    respuesta.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = {
  obtenerIdDelUsuarioPorEmail,
  obtenerUsuario,
};
