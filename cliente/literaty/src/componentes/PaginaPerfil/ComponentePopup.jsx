import { useState } from "react";
import PropTypes from "prop-types";
import principal from "../../estilos/PaginaPrincipal.module.css";
import resena from "../../estilos/PaginaResena.module.css";

function Popup({ contenido, onCerrarSesion }) {
  const contenidoPorPagina = {
    perfil: [
      { texto: "Editar perfil", ruta: "/editar-perfil" },
      { texto: "Cerrar sesión", ruta: "/", onClick: onCerrarSesion },
    ],
    resena: [
      { texto: "Libros por leer", ruta: "/libros-por-leer" },
      { texto: "Libros por comprar", ruta: "/libros-por-comprar" },
      { texto: "Libros por releer", ruta: "/libros-por-releer" },
    ],
    // Otros contenidos por página
  };

  const itemsLista = contenidoPorPagina[contenido];
  console.log(itemsLista);

  const [elementoResaltado, setElementoResaltado] = useState(null);

  return (
    <div className={`${principal["popup"]} ${resena["popup-derecha"]}`}>
      <ul>
        {itemsLista.map((item, index) => (
          <li
            style={{ listStyle: "none", cursor: "pointer" }}
            key={index}
            className={principal["popup-item"]}
            onMouseEnter={() => setElementoResaltado(index)}
            onMouseLeave={() => setElementoResaltado(null)}
          >
            <a
              href={item.ruta}
              className={
                elementoResaltado === index
                  ? principal["popup-item-destacado"]
                  : ""
              }
            >
              {item.texto}
            </a>
            {item.onClick && (
              <button onClick={item.onClick}>Cerrar sesión</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

Popup.propTypes = {
  contenido: PropTypes.string.isRequired,
  onCerrarSesion: PropTypes.func,
  className: PropTypes.string,
};

export default Popup;
