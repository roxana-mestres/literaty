import { useState } from "react";
import { Link } from "react-router-dom";
import estilosIniciarSesion from "../../estilos/IniciarSesion.module.css";
import estilos from "../../estilos/Comunes.module.css";

function ComponenteIniciarSesion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [contrasenaVisible, setContrasenaVisible] = useState(false);

  const handleInicioSesion = async (e) => {
    e.preventDefault();

    const usuario = { email, password };

    try {
      console.log("Enviando solicitud de inicio de sesión con:", usuario);
      const respuesta = await fetch(
        "https://literaty-backend.onrender.com/api/iniciar-sesion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuario),
          credentials: "include",
        }
      );

      console.log("Respuesta del servidor:", respuesta);
      const data = await respuesta.json();
      console.log("Datos recibidos:", data);
      if (data.message === "Inicio de sesión exitoso") {
        setError("");
        setExito(true);
        window.location.href = '/perfil';
      } else {
        console.error("Error al iniciar sesión:", data.message);
        setError(data.message);
        setExito(false);
      }
    } catch (error) {
      console.error("Error al conectarse con el servidor:", error);
    }
  };

  const toggleVisibilidadContrasena = () => {
    setContrasenaVisible((prevVisible) => !prevVisible);
  };

  return (
    <>
      <div className={estilosIniciarSesion["body-iniciar-sesion"]}>
        <div className={estilosIniciarSesion["contenedor-iniciar-sesion"]}>
          <div className={estilosIniciarSesion["barra-negra"]}></div>
          <Link to="/crear-cuenta">
            <span
              className={`${estilos["material-icons-outlined"]}`}
              style={{ color: "#252627", fontSize: "52px" }}
            >
              arrow_back
            </span>
          </Link>
          <div className={estilosIniciarSesion["contenido-iniciar-sesion"]}>
            <h2 className={estilos["h2-titulo"]}>Literaty_</h2>
            <div className={estilosIniciarSesion["contenedor-inicio-sesion"]}>
              <form onSubmit={handleInicioSesion}>
                <div className={estilosIniciarSesion["campo"]}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    className={estilosIniciarSesion["campo-input"]}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div
                    className={estilosIniciarSesion["mensaje-error"]}
                    style={{ display: "none" }}
                  ></div>
                </div>
                <div className={estilosIniciarSesion["campo"]}>
                  <div
                    className={`${estilosIniciarSesion["contenedor-contrasena"]} ${estilosIniciarSesion["campo-contrasena"]}`}
                  >
                    <input
                      type={contrasenaVisible ? "text" : "password"}
                      className={estilosIniciarSesion["campo-input"]}
                      placeholder="Contraseña_"
                      name="password"
                      onChange={(e) => setPassword(e.target.value)}
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
                  </div>
                  <div
                    className={estilosIniciarSesion["mensaje-error"]}
                    style={{ display: "none", marginLeft: "30px" }}
                  ></div>
                </div>
                <button type="submit" className={estilos["boton"]}>
                  Iniciar sesión
                </button>
              </form>
              <p>
                También puedes{" "}
                <b>
                  <Link to="/crear-cuenta">crear una cuenta</Link>
                </b>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ComponenteIniciarSesion;
