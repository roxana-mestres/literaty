const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../modelos/Usuario");

// Función para crear una cuenta
exports.crearCuenta = async (peticion, respuesta) => {
  try {
    const { nombre, email, password, avatar } = peticion.body;

    if (!nombre || !email || !password || avatar === undefined) {
      console.log("Error de validación: Todos los campos son obligatorios");
      return respuesta
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return respuesta.status(400).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: hashedPassword,
      avatar,
      listas: [
        {
          nombre: "Me gusta",
          icono: null,
          editable: false,
          libros: [],
          protegida: true
        }
      ]
    });

    await nuevoUsuario.save();

    const token = jwt.sign({ id: nuevoUsuario._id, email: nuevoUsuario.email}, process.env.CLAVE, {
      expiresIn: "1h",
    });

    respuesta
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      })
      .status(201)
      .json({ message: "Cuenta creada exitosamente", usuario: nuevoUsuario, token });
  } catch (error) {
    console.error("Error en la creación de cuenta:", error);
    respuesta.status(500).json({ message: "Error en el servidor", error: error.message });
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

    const token = jwt.sign({ id: usuario._id, email: usuario.email }, process.env.CLAVE, {
      expiresIn: "1h",
    });

    console.log(`Token generado para el usuario: ${token}`);

    respuesta
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      })
      .status(200)
      .json({ message: "Inicio de sesión exitoso", usuario, token });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    respuesta.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

// Rutas protegidas
exports.accesoRutaProtegida = (peticion, respuesta) => {
  const token = peticion.cookies.access_token;
  if (!token) {
    return respuesta.status(401).json({ message: "Acceso denegado. No se proporcionó un token." });
  }
  try {
    const data = jwt.verify(token, process.env.CLAVE);

    peticion.usuario = data;
    respuesta.json({ message: `Bienvenido a la ruta protegida, ${peticion.usuario.email}` });
  } catch (error) {
    respuesta.status(403).json({ message: "Token inválido o ha expirado." });
  }
};

// Ruta para cerrar sesión
exports.cerrarSesion = async (peticion, respuesta) => {
  try {
    respuesta.clearCookie("access_token");
    respuesta.status(200).json({ message: "Sesión cerrada exitosamente" });
  } catch (error) {
    respuesta.status(500).json({ message: "Error al cerrar sesión", error });
  }
};