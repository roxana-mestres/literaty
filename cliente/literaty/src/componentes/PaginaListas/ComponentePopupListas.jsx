import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import principal from "../../estilos/PaginaPrincipal.module.css";

function ComponentePopupListas({ libro, onClose }) {
  const [listasDelUsuario, setListasDelUsuario] = useState([]);

  useEffect(() => {
    const obtenerListas = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/usuario/listas');
        if (respuesta.ok) {
          const data = await respuesta.json();
          setListasDelUsuario(data);
        } else {
          console.error('Error al obtener las listas');
        }
      } catch (error) {
        console.error('Error al obtener las listas:', error);
      }
    };

    obtenerListas();
  }, []);

  const handleGuardarEnLista = (lista) => {
    console.log(`Guardar ${libro.title} en ${lista.nombre}`);
    onClose();
  };

  return (
    <div className={principal["popup-fondo"]} onClick={onClose}>
      <div className={principal["popup-lista-libros"]} onClick={(e) => e.stopPropagation()}>
        <h3>Guardar en lista</h3>
        <ul>
          {listasDelUsuario.map((lista) => (
            <li key={lista.id}>
              <label>
                <input
                  type="checkbox"
                  onClick={() => handleGuardarEnLista(lista)}
                />
                {lista.nombre}
              </label>
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}

ComponentePopupListas.propTypes = {
  libro: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ComponentePopupListas;
