import estilos from "../../estilos/Comunes.module.css";
import inicioEstilos from "../../estilos/Inicio.module.css";
import gatoSVG from "../../assets/gato.svg";

const ComponenteInicio = () => {
  return (
    <div className={estilos.body}>
      <div className={estilos["barra-negra"]}></div>
      <div
        className={`${inicioEstilos["contenedor-inicio"]} ${inicioEstilos["contenedor-dos-columnas-inicio"]}`}
      >
        <div className={inicioEstilos["contenido-centrado-inicio"]}>
          <h1 className={estilos["h1-titulo"]}>Literaty</h1>
          <h3 className={estilos["h3-titulo"]}>
            Encuentra tu próximo libro favorito
          </h3>
          <div
            className={`${estilos["botones-contenedor-inicio"]} ${inicioEstilos["botones-inicio"]}`}
          >
            <button className={`${estilos["boton"]} ${estilos["inicio"]}`}>
              <a href="crear-cuenta">Crear cuenta</a>
            </button>
            <button className={`${estilos["boton"]} ${estilos["inicio"]}`}>
              <a href="iniciar-sesion">Iniciar sesión</a>
            </button>
          </div>
        </div>
        <div className={inicioEstilos["imagen-columna-inicio"]}>
          <img
            src={gatoSVG}
            alt="Gato"
            className={inicioEstilos["img-inicio"]}
          />
        </div>
      </div>
      <div className={estilos["barra-negra"]}></div>
    </div>
  );
};

export default ComponenteInicio;