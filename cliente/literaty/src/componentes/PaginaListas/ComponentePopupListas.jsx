import React, { useEffect } from "react";
import PropTypes from "prop-types";
import principal from "../../estilos/PaginaPrincipal.module.css";
import { useListas } from "../../contextos/contextoListas";

function ComponentePopupListas({ libro, onClose }) {
  const { listas, cargandoListas, listasSeleccionadas, cambiado, handleCambioCheckbox, handleGuardarEnListas } = useListas();

  useEffect(() => {
    if (!cargandoListas && libro) {
      const listasConLibro = listas.filter((lista) =>
        lista.libros.includes(libro.id)
      );
      console.log("Listas con el libro:", listasConLibro);
    }
  }, [libro, listas, cargandoListas]);

  const handleGuardarYCerrar = async () => {
    onClose();

    try {
      const mensaje = await handleGuardarEnListas();
      if (mensaje) {
        alert(mensaje);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al intentar guardar el libro en las listas.");
    }
  };

  return (
    <div className={principal["popup-fondo"]} onClick={onClose}>
      <div
        className={principal["popup-lista-libros"]}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Guardar en lista</h3>
        {cargandoListas ? (
          <p></p>
        ) : (
          <ul className={principal["lista"]}>
            {listas.map((lista) => (
              <li key={lista._id} className={principal["item-lista"]}>
                <label>
                  <input
                    type="checkbox"
                    checked={listasSeleccionadas.includes(lista._id)}
                    onChange={() => handleCambioCheckbox(lista._id)}
                  />
                  {lista.nombre}
                </label>
              </li>
            ))}
          </ul>
        )}
        <button onClick={onClose}>Cerrar</button>
        <button onClick={handleGuardarYCerrar} disabled={!cambiado}>Guardar</button>
      </div>
    </div>
  );
}

ComponentePopupListas.propTypes = {
  libro: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ComponentePopupListas;
