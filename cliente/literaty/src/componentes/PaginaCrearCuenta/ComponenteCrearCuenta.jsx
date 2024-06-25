import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import estilos from "../../estilos/Comunes.module.css";
import estiloCrearCuenta from "../../estilos/CrearCuenta.module.css";
import avatar1 from "../../assets/avatar-1.svg";
import avatar2 from "../../assets/avatar-2.svg";
import avatar3 from "../../assets/avatar-3.svg";
import avatar4 from "../../assets/avatar-4.svg";
import avatar5 from "../../assets/avatar-5.svg";
import avatar6 from "../../assets/avatar-6.svg";

const ComponenteCrearCuenta = () => {
  const navegar = useNavigate();
  const [exito, setExito] = useState(false);
  const [error, setError] = useState("");
  const [indiceAvatar, setIndiceAvatar] = useState(0);
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
  };

  const imagenesAvatar = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];

  const handleCambiosInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();
    const usuario = {
      ...formData,
      avatar: indiceAvatar,
    };
    const respuesta = await fetch("http://localhost:3000/api/crear-cuenta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });
    const data = await respuesta.json();
    if (data.success) {
      setExito(true);
      setError("");
      console.log('Cuenta creada con éxito. Redirigiendo a la página de inicio de sesión...');
      navegar("/iniciar-sesion");
    } else {
      setExito(false);
      setError(data.error);
      console.error(`Error al crear la cuenta: ${data}`);
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
                type="password"
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
              ></span>
              <div
                className={estiloCrearCuenta["mensaje-error"]}
                style={{ display: "none", marginLeft: "30px" }}
              ></div>
            </div>
            <div className={estiloCrearCuenta["campo"]}>
              <input
                type="password"
                className={estiloCrearCuenta["form"]}
                placeholder="Repetir contraseña_"
                name="repetirPassword"
                value={formData.repetirPassword}
                onChange={handleCambiosInput}
                required
                autoComplete="new-password"
              />
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
            <button
              className={`${estilos["boton"]} ${estilos["doble"]}`}
              style={{ backgroundColor: "#B20808" }}
            >
              <a>Google</a>
            </button>
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
