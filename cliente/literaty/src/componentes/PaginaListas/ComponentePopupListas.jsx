import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import principal from "../../estilos/PaginaPrincipal.module.css";
import { useListas } from "../../contextos/contextoListas";

function ComponentePopupListas({ libro, onClose }) {
  const { listas, agregarLibroALista, eliminarLibroDeLista, cargandoListas } = useListas();
  const [listasSeleccionadas, setListasSeleccionadas] = useState([]);
  const [cambiado, setCambiado] = useState(false); // Para rastrear si la selección cambió

  useEffect(() => {
    if (!cargandoListas) {
      const listasConLibro = listas.filter((lista) =>
        lista.libros.includes(libro.id)
      );
      setListasSeleccionadas(listasConLibro.map((lista) => lista._id));
    }
  }, [libro, listas, cargandoListas]);

  const handleCambioCheckbox = (listaId) => {
    setListasSeleccionadas((prev) => {
      if (prev.includes(listaId)) {
        // Si la lista ya está seleccionada, la desmarcamos
        return prev.filter((id) => id !== listaId);
      } else {
        // Si la lista no está seleccionada, la marcamos
        return [...prev, listaId];
      }
    });
    setCambiado(true); // Marcamos que hubo un cambio
  };

  const handleGuardarEnListas = async () => {
    // Cerrar el popup inmediatamente
    onClose();

    // Realizar operaciones de guardado en segundo plano
    setTimeout(async () => {
      let mensaje = '';
      try {
        // Obtenemos las listas a eliminar
        const listasParaEliminar = listas
          .filter((lista) => !listasSeleccionadas.includes(lista._id) && lista.libros.includes(libro.id))
          .map((lista) => lista._id);

        // Obtenemos las listas a agregar
        const listasParaAgregar = listasSeleccionadas.filter((id) => !listas.find((lista) => lista._id === id).libros.includes(libro.id));

        // Eliminamos el libro de las listas seleccionadas que ya no están en la lista de selección
        for (const listaId of listasParaEliminar) {
          await eliminarLibroDeLista(listaId, libro.id);
        }

        for (const listaId of listasParaAgregar) {
          await agregarLibroALista(listaId, libro);
        }

        if (listasParaEliminar.length > 0) {
          mensaje = "El libro ha sido eliminado correctamente.";
        }

        if (mensaje) {
          alert(mensaje);
        }
      } catch (error) {
        console.error("Error al guardar en listas:", error);
        alert("Hubo un error al intentar guardar el libro en las listas.");
      }
    }, 0);
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
        <button onClick={handleGuardarEnListas} disabled={!cambiado}>Guardar</button>
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
