import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLibros } from "../contextos/contextoLibros";
import NombreBuscador from "../componentes/PaginaPerfil/ComponenteNombreBuscador";
import SeccionLibros from "../componentes/PaginaPerfil/ComponenteSeccionLibros";
import BotonSubir from "../componentes/PaginaPerfil/ComponenteBotonSubir";
import Footer from "../componentes/PaginaPerfil/ComponenteFooter";
import ComponentePopupListas from "../componentes/PaginaListas/ComponentePopupListas";
import principal from "../estilos/PaginaPrincipal.module.css";
import resena from "../estilos/PaginaResena.module.css";

function PaginaPerfil() {
  const navegar = useNavigate();
  const { libros, cargando, obtenerLibros, handleEliminarLibro } = useLibros();
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [mostrarPopupListas, setMostrarPopupListas] = useState(false);
  const [listasDeLibros, setListasDeLibros] = useState([]);

  useEffect(() => {
    const fetchListas = async () => {
      const usuarioId = "668bafacde874b5e8bcbe4a3";
      try {
        console.log(`Fetching listas for usuarioId: ${usuarioId}`);
        const respuesta = await fetch(
          `http://localhost:3000/api/listas/${usuarioId}`
        );
        if (!respuesta.ok) {
          throw new Error("Error al obtener las listas");
        }
        let data = await respuesta.json();
        setListasDeLibros(data);
      } catch (error) {
        console.error("Error al obtener las listas:", error);
      }
    };

    fetchListas();
  }, []);

  const onIconClick = (icono) => {
    if (icono === "person") {
      setMostrarPopup((prevMostrarPopup) => !prevMostrarPopup);
    } else if (icono === "bookmark") {
      navegar("/listas");
    } else if (icono === "refresh") {
      obtenerLibros();
    }
  };

  const handleLinkClick = (ruta) => {
    setMostrarPopup(false);
    navegar(ruta);
  };

  const handleBusqueda = async (termino) => {
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/buscar?termino=${encodeURIComponent(
          termino
        )}`
      );
      if (respuesta.ok) {
        const data = await respuesta.json();
        setLibros(data);
      } else {
        console.error("Error al buscar libros");
      }
    } catch (error) {
      console.error("Error al buscar libros:", error);
    }
  };

  const handleCerrarSesion = async (e) => {
    e.preventDefault();
    if (mostrarPopup) {
      try {
        const respuesta = await fetch(
          "http://localhost:3000/api/cerrar-sesion",
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (respuesta.ok) {
          console.log("Cierre de sesión exitoso");
          navegar("/");
        } else {
          console.error("Error al cerrar sesión");
        }
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    }
  };

  const abrirPopupLista = (libro) => {
    setLibroSeleccionado(libro);
    setMostrarPopupListas(true);
  };

  const cerrarPopupLista = () => {
    setMostrarPopupListas(false);
    setLibroSeleccionado(null);
  };

  return (
    <div>
      <NombreBuscador onBusqueda={handleBusqueda} />
      {cargando ? (
        <h3 className={principal.cargando}>Buscando nuevos libros 👀...</h3>
      ) : (
        <SeccionLibros
          librosGoogleBooks={libros}
          onEliminarLibro={handleEliminarLibro}
          onBookmarkClick={abrirPopupLista}
        />
      )}
      <Footer
        iconos={["bookmark", "refresh", "person"]}
        onIconClick={onIconClick}
      />
      {mostrarPopup && (
        <>
          <div
            className={resena["popup-fondo"]}
            onClick={() => setMostrarPopup(false)}
          />
          <div className={resena["popup-derecha"]}>
            <ul>
              <li>
                <button onClick={() => handleLinkClick("/editar-perfil")}>
                  Editar perfil
                </button>
              </li>
              <li>
                <button onClick={handleCerrarSesion}>Cerrar sesión</button>
              </li>
            </ul>
          </div>
        </>
      )}
      {mostrarPopupListas && (
        <ComponentePopupListas
          libro={libroSeleccionado}
          onClose={cerrarPopupLista}
          listasDeLibros={listasDeLibros}
        />
      )}
      <BotonSubir colorBoton="#252627" />
    </div>
  );
}

export default PaginaPerfil;
