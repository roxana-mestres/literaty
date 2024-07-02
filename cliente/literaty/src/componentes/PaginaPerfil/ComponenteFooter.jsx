import PropTypes from "prop-types";
import principal from "../../estilos/PaginaPrincipal.module.css";
import BotonSubir from "../../componentes/PaginaPerfil/ComponenteBotonSubir";

function Footer({ iconos, onIconClick }) {
  return (
    <>
      <div className={principal["footer"]} style={{ marginTop: "20px" }}>
        {iconos.map((icono, index) => (
          <button
            key={index}
            className="material-symbols-outlined"
            style={{
              fontSize: "45px",
              cursor: "pointer",
              border: "none",
              background: "none",
            }}
            onClick={() => onIconClick(icono)}
          >
            {icono}
          </button>
        ))}
        <BotonSubir />
      </div>
    </>
  );
}

Footer.propTypes = {
  iconos: PropTypes.arrayOf(PropTypes.string).isRequired,
  onIconClick: PropTypes.func.isRequired,
};

export default Footer;
