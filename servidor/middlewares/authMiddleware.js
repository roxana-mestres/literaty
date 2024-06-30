const jwt = require("jsonwebtoken");

const authMiddleware = (peticion, respuesta, siguiente) => {
  const token = peticion.cookies.token;
  console.log("Token authMiddleware:", token);
  if (!token) {
    return respuesta
      .status(401)
      .json({ message: "No hay token, autorización denegada." });
  }

  try {
    const decodificado = jwt.verify(token, process.env.CLAVE);
    peticion.usuario = decodificado.usuario || { id: decodificado.id };
    
    console.log("Decodificado:", decodificado);
    siguiente();
  } catch (error) {
    respuesta.status(401).json({ message: "El token no es válido", error });
  }
};

module.exports = authMiddleware;
