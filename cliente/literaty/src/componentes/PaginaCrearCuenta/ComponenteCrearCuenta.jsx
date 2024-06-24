import estilos from "../../estilos/Comunes.module.css";
import estiloCrearCuenta from "../../estilos/CrearCuenta.module.css";

const ComponenteCrearCuenta = () => {
  const saveUser = async (e) => {
    e.preventDefault();
  };

  return (
    <div
      className={`${estilos.body} ${estiloCrearCuenta["body-crear-cuenta"]}`}
    >
      <div className={estiloCrearCuenta["contenedor-crear-cuenta"]}>
        <div className={estiloCrearCuenta["crear-cuenta"]}>
          <form action="/crear-cuenta" method="POST" onSubmit={saveUser}>
            <div className={estiloCrearCuenta["campo"]}>
              <input
                type="text"
                className={estiloCrearCuenta["form"]}
                placeholder="Nombre_"
                name="nombre"
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
                type="text"
                className={estiloCrearCuenta["form"]}
                placeholder="Apellidos_"
                name="apellido"
                autoComplete="new-last-name"
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
                autoComplete="new-email"
              />
              <div
                className={estiloCrearCuenta["mensaje-error"]}
                style={{ display: "none" }}
              ></div>
            </div>
            <div className={estiloCrearCuenta["campo"]}>
              <input
                className={estiloCrearCuenta["form"]}
                placeholder="Contraseña_"
                name="contrasena"
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
            <button
              className={`${estilos["boton"]} ${estilos["doble"]}`}
              style={{ backgroundColor: "#FF3131" }}
            >
              <a>Google</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponenteCrearCuenta;
