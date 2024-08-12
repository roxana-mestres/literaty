import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import principal from "../../estilos/PaginaPrincipal.module.css";

function BotonSubir(props) {
  const [mostrarBotonSubir, setMostrarBotonSubir] = useState(false);

  useEffect(() => {
    const manejarScroll = () => {
      if (window.pageYOffset > 100) {
        setMostrarBotonSubir(true);
      } else {
        setMostrarBotonSubir(false);
      }
    };

    window.addEventListener("scroll", manejarScroll);

    return () => {
      window.removeEventListener("scroll", manejarScroll);
    };
  }, []);

  const manejarSubirArriba = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const estiloBoton = {
    fontSize: "60px",
    cursor: "pointer",
    color: props.colorBoton,
    lineHeight: "20px",
  };

  return (
    <div className={principal["div-sobre-footer"]}>
      {mostrarBotonSubir && (
        <a
          href=""
          className={`material-symbols-outlined ${principal["boton-subir"]}`}
          style={estiloBoton}
          onClick={manejarSubirArriba}
        >
          expand_less
        </a>
      )}
    </div>
  );
}

BotonSubir.propTypes = {
  colorBoton: PropTypes.string,
};

export default BotonSubir;
