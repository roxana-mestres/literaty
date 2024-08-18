const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../modelos/Usuario");

exports.crearCuenta = async (peticion, respuesta) => {
  try {
    console.log("Cookies recibidas al crear cuenta:", peticion.cookies);
    const { nombre, email, password, avatar } = peticion.body;

    if (!nombre || !email || !password || avatar === undefined) {
      return respuesta.status(400).json({ message: "Todos los campos son obligatorios" });
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

    const token = jwt.sign({ id: nuevoUsuario._id, email: nuevoUsuario.email }, process.env.CLAVE, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ id: nuevoUsuario._id, email: nuevoUsuario.email }, process.env.CLAVE_REFRESH, {
      expiresIn: "7d",
    });

    nuevoUsuario.refreshToken = refreshToken;
    await nuevoUsuario.save();

    respuesta
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expiresIn: "15m"
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .status(201)
      .json({ message: "Cuenta creada exitosamente", usuario: nuevoUsuario, token });
      console.log("Cookies establecidas tras crear cuenta:", {
        access_token: token,
        refresh_token: refreshToken
      });
  } catch (error) {
    console.error("Error en la creación de cuenta:", error);
    respuesta.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};


exports.iniciarSesion = async (peticion, respuesta) => {
  try {
    console.log("Cookies recibidas al iniciar sesión:", peticion.cookies);
    const { email, password } = peticion.body;

    if (!email || !password) {
      return respuesta.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return respuesta.status(400).json({ message: "Credenciales incorrectas" });
    }

    const coincide = await bcrypt.compare(password, usuario.password);
    if (!coincide) {
      return respuesta.status(400).json({ message: "Credenciales incorrectas" });
    }

    const token = jwt.sign({ id: usuario._id, email: usuario.email }, process.env.CLAVE, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ id: usuario._id, email: usuario.email }, process.env.CLAVE_REFRESH, {
      expiresIn: "7d",
    });

    usuario.refreshToken = refreshToken;
    await usuario.save();

    respuesta
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expiresIn: "15m"
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .status(200)
      .json({ message: "Inicio de sesión exitoso", usuario, token });
      console.log("Cookies establecidas tras iniciar sesión:", {
        access_token: token,
        refresh_token: refreshToken
      });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    respuesta.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

exports.refrescarToken = async (peticion, respuesta) => {
  const { refresh_token } = peticion.cookies;
  console.log("Cookies recibidas al refrescar token:", peticion.cookies);

  if (!refresh_token) {
    console.log("No se proporcionó refresh token.");
    return respuesta.status(401).json({ message: "No se proporcionó refresh token." });
  }

  try {
    const data = jwt.verify(refresh_token, process.env.CLAVE_REFRESH);
    console.log("Datos decodificados del refresh token:", data);

    const usuario = await Usuario.findById(data.id);

    if (!usuario || usuario.refreshToken !== refresh_token) {
      console.log("Refresh token inválido.");
      return respuesta.status(403).json({ message: "Refresh token inválido." });
    }

    const nuevoAccessToken = jwt.sign({ id: usuario._id, email: usuario.email }, process.env.CLAVE, {
      expiresIn: "15m",
    });

    respuesta.cookie("access_token", nuevoAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expiresIn: "15m"
    });

    console.log("Nuevo access token generado:", nuevoAccessToken);
    respuesta.json({ accessToken: nuevoAccessToken });
  } catch (error) {
    console.error("Error al refrescar token:", error);
    respuesta.status(403).json({ message: "Token de refresco inválido o expirado." });
  }
};

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

exports.cerrarSesion = async (peticion, respuesta) => {
  try {
    const { refresh_token } = peticion.cookies;
    if (refresh_token) {
      await Usuario.updateOne({ refreshToken: refresh_token }, { $unset: { refreshToken: 1 } });
    }
    respuesta.clearCookie("access_token");
    respuesta.clearCookie("refresh_token");
    respuesta.status(200).json({ message: "Sesión cerrada exitosamente" });
  } catch (error) {
    respuesta.status(500).json({ message: "Error al cerrar sesión", error });
  }
};
