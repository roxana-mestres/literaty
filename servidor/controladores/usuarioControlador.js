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

const actualizarUsuario = async (peticion, respuesta) => {
  const { usuarioId } = peticion.params;
  const { nombre, email, avatar } = peticion.body;

  console.log('Parámetros recibidos:', peticion.params);
  console.log('Cuerpo de la solicitud:', peticion.body);

  try {
    const usuario = await Usuario.findById(usuarioId);

    console.log('Usuario encontrado:', usuario);

    if (!usuario) {
      console.log('Usuario no encontrado');
      return respuesta.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    usuario.nombre = nombre || usuario.nombre;
    usuario.email = email || usuario.email;
    usuario.avatar = avatar !== undefined ? avatar : usuario.avatar;

    await usuario.save();

    console.log('Usuario actualizado:', usuario);

    respuesta.json(usuario);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    respuesta.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = {
  obtenerIdDelUsuarioPorEmail,
  obtenerUsuario,
  actualizarUsuario,
};
