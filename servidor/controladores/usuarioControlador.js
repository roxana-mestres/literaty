const Usuario = require("../modelos/Usuario");
const bcrypt = require("bcrypt");

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

const actualizarContrasena = async (peticion, respuesta) => {
  const { usuarioId } = peticion.params;
  const { contrasenaActual, contrasena } = peticion.body;

  console.log('ID de usuario:', usuarioId);
  console.log('Contraseña actual:', contrasenaActual);
  console.log('Nueva contraseña:', contrasena);

  try {
    const usuario = await Usuario.findById(usuarioId);
    console.log('Usuario encontrado:', usuario);

    if (!usuario) {
      return respuesta.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    if (!contrasenaActual || !contrasena) {
      console.log('Datos de contraseña faltantes.');
      return respuesta.status(400).json({ mensaje: 'Datos de contraseña incompletos' });
    }

    const contrasenaValida = await bcrypt.compare(contrasenaActual, usuario.password);
    console.log('Contraseña actual válida:', contrasenaValida);

    if (!contrasenaValida) {
      return respuesta.status(400).json({ mensaje: 'La contraseña actual es incorrecta' });
    }

    if (!validarContrasena(contrasena)) {
      return respuesta.status(400).json({ mensaje: 'La nueva contraseña no cumple con los requisitos' });
    }

    const nuevaContrasenaHash = await bcrypt.hash(contrasena, 10);
    console.log('Nueva contraseña hasheada:', nuevaContrasenaHash);

    usuario.password = nuevaContrasenaHash;
    await usuario.save();

    respuesta.json({ mensaje: 'Contraseña actualizada con éxito' });
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    respuesta.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

const validarContrasena = (password) => {
  const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
  return regexContrasena.test(password);
};

module.exports = {
  obtenerIdDelUsuarioPorEmail,
  obtenerUsuario,
  actualizarUsuario,
  actualizarContrasena,
};
