import estilosIniciarSesion from "../../estilos/IniciarSesion.module.css";
import estilos from "../../estilos/Comunes.module.css";

function ComponenteIniciarSesion() {
  return (
    <>
      <div className={estilosIniciarSesion["body-iniciar-sesion"]}>
        <div className={estilosIniciarSesion["contenedor-iniciar-sesion"]}>
          <div className={estilosIniciarSesion["barra-negra"]}></div>
            <span
              className={`${estilos["material-icons-outlined"]}`}
              style={{ color: "#252627", fontSize: "52px" }}
            >
              arrow_back
            </span>
          <div className={estilosIniciarSesion["contenido-iniciar-sesion"]}>
            <h2 className={estilos["h2-titulo"]}>Literaty_</h2>
            <div className={estilosIniciarSesion["contenedor-inicio-sesion"]}>
              <form action="/iniciar-sesion" method="POST">
                <div className={estilosIniciarSesion["campo"]}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    className={estilosIniciarSesion["campo-input"]}
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
                      className={estilosIniciarSesion["campo-input"]}
                      placeholder="Contraseña_"
                      name="contrasena"
                      required
                      autoComplete="new-password"
                    />
                    <span
                      className={`${estilos["material-icons-outlined"]} ${estilos["icono-ojo"]} ${estilos["icono-ojo-cerrado"]}`}
                      style={{ fontSize: "1em" }}
                    ></span>
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
                También puedes <b>crear una cuenta</b>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ComponenteIniciarSesion;
