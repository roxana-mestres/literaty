import { useState } from "react";
import { useUsuario } from '../../contextos/contextoUsuario';
import estilos from "../../estilos/Comunes.module.css";
import avatar0 from "../../assets/avatar-0.svg";
import avatar1 from "../../assets/avatar-1.svg";
import avatar2 from "../../assets/avatar-2.svg";
import avatar3 from "../../assets/avatar-3.svg";
import avatar4 from "../../assets/avatar-4.svg";
import avatar5 from "../../assets/avatar-5.svg";
import principal from "../../estilos/PaginaPrincipal.module.css";
import PropTypes from "prop-types";

function NombreBuscador({ className, claseBuscador, onBusqueda }) {
  const [termino, setTermino] = useState("");
  const { usuario } = useUsuario();

  const avatares = {
    0: avatar0,
    1: avatar1,
    2: avatar2,
    3: avatar3,
    4: avatar4,
    5: avatar5,
  };

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
              {usuario.nombre}!
            </h3>
            <img
            src={avatares[usuario.avatar]}
            alt="avatar"
            width={"100px"}
          />
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
            style={{
              color: "#f4e5e0",
              fontSize: "25px",
              paddingRight: "10px",
              cursor: "pointer",
            }}
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
