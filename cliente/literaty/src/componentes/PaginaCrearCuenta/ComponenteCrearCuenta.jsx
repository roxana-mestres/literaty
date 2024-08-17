import { useState, useEffect } from "react";
import estilos from "../../estilos/Comunes.module.css";
import estiloCrearCuenta from "../../estilos/CrearCuenta.module.css";
import avatar1 from "../../assets/avatar-1.svg";
import avatar2 from "../../assets/avatar-2.svg";
import avatar3 from "../../assets/avatar-3.svg";
import avatar4 from "../../assets/avatar-4.svg";
import avatar5 from "../../assets/avatar-5.svg";

const ComponenteCrearCuenta = () => {
  const [exito, setExito] = useState(false);
  const [error, setError] = useState("");
  const [indiceAvatar, setIndiceAvatar] = useState(0);
  const [contrasenaVisible, setContrasenaVisible] = useState(false);
  const [repetirContrasenaVisible, setRepetirContrasenaVisible] =
    useState(false);
  const imagenesAvatar = [avatar1, avatar2, avatar3, avatar4, avatar5];
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    repetirPassword: "",
    avatar: indiceAvatar,
  });

  useEffect(() => {
    setFormData({ ...formData, avatar: indiceAvatar });
  }, [indiceAvatar]);

  const cambiarAvatar = () => {
    setIndiceAvatar((prevIndice) => (prevIndice + 1) % imagenesAvatar.length);
    console.log("Avatar actual", indiceAvatar);
  };

  const handleCambiosInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleVisibilidadContrasena = () => {
    setContrasenaVisible((prevVisible) => !prevVisible);
  };

  const toggleVisibilidadRepetirContrasena = () => {
    setRepetirContrasenaVisible((prevVisible) => !prevVisible);
  };

  const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d])[a-zA-Z\d\w\W]{8,}$/;

const validarContrasena = (password) => {
  return regexContrasena.test(password);
};  

  const validarCorreo = (email) => {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/.test(email);
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();

    if (typeof formData.avatar !== "number") {
      console.error("El avatar no es un número válido")
      return;
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/.test(formData.nombre)) {
      alert("El nombre solo debe contener letras.");
      return;
    }

    if (!validarCorreo(formData.email)) {
      alert("Correo electrónico no válido.");
      return;
    }

    if (formData.password !== formData.repetirPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    if (!validarContrasena(formData.password)) {
      alert(
        "La contraseña debe incluir al menos 8 caracteres, 1 número y 1 símbolo."
      );
      return;
    }

    const usuario = {
      ...formData,
      avatar: indiceAvatar,
    };

    console.log("Datos del usuario a enviar:", usuario);

    const respuesta = await fetch("https://literaty-backend.onrender.com/api/crear-cuenta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });
    const data = await respuesta.json();
    if (respuesta.ok && data.message === "Cuenta creada exitosamente") {
      setExito(true);
      setError("");
      console.log("Cuenta creada con éxito. Redirigiendo a la página de inicio de sesión...");
      console.log("Llamando a la función de navegación...");
      window.location.href = '/iniciar-sesion';
    } else {
      setExito(false);
      setError(data.message || "Error desconocido");
      console.error(`Error al crear la cuenta: ${JSON.stringify(data)}`);
    }
  };

  return (
    <div
      className={`${estilos.body} ${estiloCrearCuenta["body-crear-cuenta"]}`}
    >
      <div className={estiloCrearCuenta["contenedor-crear-cuenta"]}>
        <div className={estiloCrearCuenta["crear-cuenta"]}>
          <div className={estiloCrearCuenta["avatar"]} onClick={cambiarAvatar}>
            {imagenesAvatar.map((imagen, index) => (
              <div
                key={index}
                className={`${estiloCrearCuenta["avatar-imagen"]} ${
                  estiloCrearCuenta["avatar-" + (index + 1)]
                } ${
                  index === indiceAvatar ? estiloCrearCuenta["visible"] : ""
                }`}
                style={{
                  backgroundImage: `url(${imagen})`,
                  display: index === indiceAvatar ? "block" : "none",
                }}
              ></div>
            ))}
          </div>
          <form onSubmit={guardarUsuario}>
            <div className={estiloCrearCuenta["campo"]}>
              <input
                type="text"
                className={estiloCrearCuenta["form"]}
                placeholder="Nombre_"
                name="nombre"
                value={formData.nombre}
                onChange={handleCambiosInput}
                required
                autoComplete="new-name"
              />
              <div
                className={estiloCrearCuenta["mensaje-error"]}
                style={{ display: "none" }}
              ></div>
            </div>
            <div className={estiloCrearCuenta["campo"]}>
              <input
                type="email"
                className={estiloCrearCuenta["form"]}
                placeholder="Correo electrónico_"
                required
                name="email"
                value={formData.email}
                onChange={handleCambiosInput}
                autoComplete="new-email"
              />
              <div
                className={estiloCrearCuenta["mensaje-error"]}
                style={{ display: "none" }}
              ></div>
            </div>
            <div className={estiloCrearCuenta["campo"]}>
              <input
                type={contrasenaVisible ? "text" : "password"}
                className={estiloCrearCuenta["form"]}
                placeholder="Contraseña_"
                name="password"
                value={formData.password}
                onChange={handleCambiosInput}
                required
                autoComplete="new-password"
              />
              <span
                className={`${estilos["material-icons-outlined"]} ${estilos["icono-ojo"]} ${estilos["icono-ojo-cerrado"]}`}
                style={{ fontSize: "1em" }}
                onClick={toggleVisibilidadContrasena}
              >
                {contrasenaVisible ? "visibility_off" : "visibility"}
              </span>
              <div
                className={estiloCrearCuenta["mensaje-error"]}
                style={{ display: "none", marginLeft: "30px" }}
              ></div>
            </div>
            <div className={estiloCrearCuenta["campo"]}>
              <input
                type={repetirContrasenaVisible ? "text" : "password"}
                className={estiloCrearCuenta["form"]}
                placeholder="Repetir contraseña_"
                name="repetirPassword"
                value={formData.repetirPassword}
                onChange={handleCambiosInput}
                required
                autoComplete="new-password"
              />
              <span
                className={`${estilos["material-icons-outlined"]} ${estilos["icono-ojo"]} ${estilos["icono-ojo-cerrado"]}`}
                style={{ fontSize: "1em" }}
                onClick={toggleVisibilidadRepetirContrasena}
              >
                {repetirContrasenaVisible ? "visibility_off" : "visibility"}
              </span>
              <div
                className={estiloCrearCuenta["mensaje-error"]}
                style={{ display: "none" }}
              ></div>
            </div>
            <button
              className={`${estilos["boton-reverso"]} ${estilos["doble"]} ${estiloCrearCuenta["boton-crear-cuenta"]}`}
              type="submit"
            >
              <b>Crear cuenta</b>
            </button>
          </form>
        </div>
        <div className={estiloCrearCuenta["inicio-sesion"]}>
          <h2 className={estiloCrearCuenta["h2-titulo-CC"]}>
            ¿Ya tienes cuenta? <br /> Inicia sesión
          </h2>
          <div className={estiloCrearCuenta["botones"]}>
            <button className={`${estilos["boton"]} ${estilos["doble"]}`}>
              <a href="/iniciar-sesion">Iniciar sesión</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponenteCrearCuenta;
