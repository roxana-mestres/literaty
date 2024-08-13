const jwt = require('jsonwebtoken');

const verificarToken = (peticion, respuesta, siguiente) => {
  const token = peticion.cookies.access_token;
  console.log("Token recibido authMiddleware:", token);
  if (!token) {
    return respuesta.status(403).json({ message: "Acceso denegado, token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.CLAVE);
    peticion.usuario = decoded;
    siguiente();
  } catch (error) {
    return respuesta.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = verificarToken;
