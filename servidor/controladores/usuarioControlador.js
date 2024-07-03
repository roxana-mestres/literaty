const Usuario = require("../modelos/Usuario");

const obtenerIdDelUsuarioPorEmail = async (email) => {
  try {
    const usuario = await Usuario.findOne({ email }).select('_id');
    return usuario ? usuario._id : null;
  } catch (error) {
    throw new Error("Error al obtener ID del usuario por email");
  }
};

module.exports = { obtenerIdDelUsuarioPorEmail};
