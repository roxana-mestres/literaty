import { Link } from "react-router-dom";
import estilos from "../estilos/Comunes.module.css";
import estilosAdicionales from "../estilos/PaginasAdicionales.module.css";

function Pagina401() {
  return (
    <>
      <div className={`${estilosAdicionales["div-body"]}`}>
        <div className={estilos["barra-negra"]}></div>
        <div className={`${estilosAdicionales["contenedor"]}`}>
          <div className={`${estilosAdicionales["contenido-centrado"]}`}>
            <h2>Esta página no existe</h2>
            <button
              className={`${estilos["boton"]} ${estilosAdicionales["boton"]}`}
            >
              <Link to="/">Ir a inicio</Link>
            </button>
          </div>
        </div>
        <div className={estilos["barra-negra"]}></div>
      </div>
    </>
  );
}

export default Pagina401;
