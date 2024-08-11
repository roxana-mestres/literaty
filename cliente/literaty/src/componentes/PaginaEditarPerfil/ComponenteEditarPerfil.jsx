import estilos from "../../estilos/Comunes.module.css";
import PropTypes from "prop-types";
import estilosEditarPerfil from "../../estilos/EditarPerfil.module.css";
import estilosIniciarSesion from "../../estilos/IniciarSesion.module.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function EditarPerfil({
  contenidoPersonalizado,
  claseContenido,
  dataUsuario,
  onGuardar,
}) {
  const [datosUsuario, setDatosUsuario] = useState({});

  useEffect(() => {
    setDatosUsuario(dataUsuario);
  }, [dataUsuario]);

  return (
    <div className={estilosEditarPerfil["cuerpo-editar-perfil"]}>
      <Link
        to="/perfil"
        className={estilosEditarPerfil["flecha-editar-perfil"]}
      >
        <span
          className={`${estilos["material-icons-outlined"]}`}
          style={{ color: "#252627", fontSize: "52px" }}
        >
          arrow_back
        </span>
      </Link>
      <div
        className={`${estilosIniciarSesion["contenido-iniciar-sesion"]} ${claseContenido}`}
      >
        {contenidoPersonalizado}
        <button
          className={`${estilos["boton"]} ${estilosEditarPerfil["boton-guardar"]}`}
          onClick={onGuardar}
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

EditarPerfil.propTypes = {
  contenidoPersonalizado: PropTypes.node.isRequired,
  claseContenido: PropTypes.string,
  actualizarDataUsuario: PropTypes.func.isRequired,
  dataUsuario: PropTypes.object.isRequired,
  onGuardar: PropTypes.func.isRequired, 
};

export default EditarPerfil;
