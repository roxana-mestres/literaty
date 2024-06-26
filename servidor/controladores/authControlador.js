const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../modelos/Usuario");

// Función para registrar un nuevo usuario
exports.crearCuenta = async (peticion, respuesta) => {
  try {
    const { nombre, email, password, avatar } = peticion.body;
        
    if (!nombre || !email || !password || avatar === undefined) {
      console.log("Error de validación: Todos los campos son obligatorios");
      return respuesta
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return respuesta.status(400).json({ message: "El usuario ya existe" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: hashedPassword,
      avatar,
    });
    await nuevoUsuario.save();

    // Crear token JWT
    const token = jwt.sign({ id: nuevoUsuario._id }, process.env.CLAVE, {
      expiresIn: "1h",
    });

    // Configurar la cookie con el token
    respuesta.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      maxAge: 3600000,
    });

    respuesta.status(201).json({ message: "Usuario creado exitosamente" });
  } catch (error) {
    respuesta.status(500).json({ message: "Error en el servidor", error });
  }
};

// Función para iniciar sesión
exports.iniciarSesion = async (peticion, respuesta) => {
  try {
    const { email, password } = peticion.body;

    // Validar datos del formulario
    if (!email || !password) {
      return respuesta
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return respuesta
        .status(400)
        .json({ message: "Credenciales incorrectas" });
    }

    // Verificar la contraseña
    const coincide = await bcrypt.compare(password, usuario.password);
    if (!coincide) {
      return respuesta
        .status(400)
        .json({ message: "Credenciales incorrectas" });
    }

    // Crear token JWT
    const token = jwt.sign({ id: usuario._id }, process.env.CLAVE, {
      expiresIn: "1h",
    });

    // Configurar la cookie con el token
    respuesta.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      maxAge: 3600000,
    });

    respuesta.status(200).json({ message: "Inicio de sesión exitoso" });
  } catch (error) {
    respuesta.status(500).json({ message: "Error en el servidor", error });
  }
};

// Ruta para cerrar sesión
exports.cerrarSesion = async (peticion, respuesta) => {
  try {
    respuesta.clearCookie("token");
    respuesta.status(200).json({ message: "Sesión cerrada exitosamente" });
  } catch (error) {
    respuesta.status(500).json({ message: "Error al cerrar sesión", error });
  }
};
