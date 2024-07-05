import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import principal from "../../estilos/PaginaPrincipal.module.css";

const usuarioId = "6686d98dc48ba205fb80895e";

function ComponentePopupListas({ libro, onClose, listasDeLibros }) {
  const [listasSeleccionadas, setListasSeleccionadas] = useState([]);

  useEffect(() => {
    const listasConLibro = listasDeLibros.filter((lista) =>
      lista.libros.includes(libro.id)
    );
    setListasSeleccionadas(listasConLibro.map((lista) => lista._id));
  }, [libro, listasDeLibros]);

  const handleCambioCheckbox = async (listaId) => {
    const seleccionado = listasSeleccionadas.includes(listaId);
    console.log(
      `Cambio en checkbox para lista ${listaId}: ${
        seleccionado ? "Desmarcando" : "Marcando"
      }`
    );
    if (seleccionado) {
      try {
        const respuesta = await fetch(
          `http://localhost:3000/api/usuarios/${usuarioId}/listas/${listaId}/libros/${libro.id}`,
          {
            method: "DELETE",
          }
        );
        if (!respuesta.ok) {
          const errorText = await respuesta.text();
          throw new Error(
            `Error al eliminar el libro de la lista: ${errorText}`
          );
        }
        const nuevasListasSeleccionadas = listasSeleccionadas.filter(
          (id) => id !== listaId
        );
        setListasSeleccionadas(nuevasListasSeleccionadas);
        console.log("Lista después de eliminación:", nuevasListasSeleccionadas);
      } catch (error) {
        console.error("Error al eliminar el libro de la lista:", error);
      }
    } else {
      try {
        const respuesta = await fetch(
          `http://localhost:3000/api/usuarios/listas/${listaId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ libroId: libro.id, usuarioId }),
          }
        );
        if (!respuesta.ok) {
          const errorText = await respuesta.text();
          throw new Error(`Error al agregar el libro a la lista: ${errorText}`);
        }
        const nuevasListasSeleccionadas = [...listasSeleccionadas, listaId];
        setListasSeleccionadas(nuevasListasSeleccionadas);
        console.log("Lista después de adición:", nuevasListasSeleccionadas);
      } catch (error) {
        console.error("Error al agregar el libro a la lista:", error);
      }
    }
  };

  const actualizarListas = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${usuarioId}/listas`);
      const listasActualizadas = await response.json();
      setListasSeleccionadas(listasActualizadas.map((lista) => lista._id));
    } catch (error) {
      console.error('Error al obtener las listas actualizadas:', error);
    }
  };

  const handleGuardarEnListas = async () => {
    try {
      const operaciones = [];
      const listasParaAgregar = listasDeLibros.filter(
        (lista) =>
          listasSeleccionadas.includes(lista._id) &&
          !lista.libros.includes(libro.id)
      );
      const listasParaEliminar = listasDeLibros.filter(
        (lista) =>
          !listasSeleccionadas.includes(lista._id) &&
          lista.libros.includes(libro.id)
      );

      console.log("Listas para agregar:", listasParaAgregar);
      console.log("Listas para eliminar:", listasParaEliminar);

      listasParaAgregar.forEach((lista) => {
        operaciones.push(
          fetch(`http://localhost:3000/api/usuarios/listas/${lista._id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ libroId: libro.id, usuarioId }),
          })
        );
      });

      listasParaEliminar.forEach((lista) => {
        operaciones.push(
          fetch(
            `http://localhost:3000/api/usuarios/${usuarioId}/listas/${lista._id}/libros/${libro.id}`,
            {
              method: "DELETE",
            }
          )
        );
      });

      await Promise.all(operaciones);

      await actualizarListas();

      if (listasParaAgregar.length > 0 && listasParaEliminar.length > 0) {
        alert("El libro se ha actualizado correctamente en las listas.");
      } else if (listasParaAgregar.length > 0) {
        alert("El libro se ha guardado correctamente en las listas.");
      } else if (listasParaEliminar.length > 0) {
        alert("El libro se ha eliminado correctamente de las listas.");
      } else {
        alert("No se realizaron cambios.");
      }

      onClose();
    } catch (error) {
      console.error("Error al guardar el libro en las listas:", error);
    }
  };

  return (
    <div className={principal["popup-fondo"]} onClick={onClose}>
      <div
        className={principal["popup-lista-libros"]}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Guardar en lista</h3>
        <ul className={principal["lista"]}>
          {listasDeLibros.map((lista) => (
            <li key={lista._id} className={principal["item-lista"]}>
              <label>
                <input
                  type="checkbox"
                  checked={listasSeleccionadas?.includes(lista._id) || false}
                  onChange={() => handleCambioCheckbox(lista._id)}
                />
                {lista.nombre}
              </label>
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Cerrar</button>
        <button onClick={handleGuardarEnListas}>Guardar</button>
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
  listasDeLibros: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      libros: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
};

export default ComponentePopupListas;
