import { useState } from "react";
import estilos from "../../estilos/Comunes.module.css";
import principal from "../../estilos/PaginaPrincipal.module.css";
import avatar4 from "../../assets/avatar-4.svg";
import PropTypes from "prop-types";

function NombreBuscador({ className, claseBuscador, onBusqueda }) {
  const [termino, setTermino] = useState("");
  const nombre = "Roxana";

  const manejarCambio = (event) => {
    setTermino(event.target.value);
  };

  const manejarKeyPress = (event) => {
    if (event.key === "Enter") {
      manejarBusqueda();
    }
  };

  const manejarBusqueda = () => {
    if (onBusqueda) {
      onBusqueda(termino);
    }
  };

  return (
    <>
      <div className={`${principal["divAvatarBuscadorNotas"]}`}>
        <div style={{ backgroundColor: "#f4e5e0" }}>
          <div className={`${principal["nombreAvatarNotas"]} ${className}`}>
            <h3 className={`${estilos["h3-titulo"]} ${principal["h3-notas"]}`}>
              ¡Hola,
              <br />
              {nombre}!
            </h3>
            <img src={avatar4} alt="avatar" width={"100px"} />
          </div>
        </div>
        <div className={`${principal["buscador"]} ${claseBuscador}`}>
          <input
            type="text"
            placeholder="Buscar..."
            value={termino}
            onChange={manejarCambio}
            onKeyPress={manejarKeyPress}
          />
          <span
            className={estilos["material-icons-outlined"]}
            style={{ color: "#f4e5e0", fontSize: "25px", paddingRight: "10px", cursor: "pointer" }}
            onClick={manejarBusqueda}
          >
            search
          </span>
        </div>
      </div>
    </>
  );
}

NombreBuscador.propTypes = {
  className: PropTypes.string,
  claseBuscador: PropTypes.string,
  onBusqueda: PropTypes.func,
};

export default NombreBuscador;
