import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NombreBuscador from "../componentes/PaginaPerfil/ComponenteNombreBuscador";
import SeccionLibros from "../componentes/PaginaPerfil/ComponenteSeccionLibros";
import BotonSubir from "../componentes/PaginaPerfil/ComponenteBotonSubir";
import Footer from "../componentes/PaginaPerfil/ComponenteFooter";
import resena from "../estilos/PaginaResena.module.css";
import principal from "../estilos/PaginaPrincipal.module.css";

function PaginaPerfil() {
  const navegar = useNavigate();
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarLibros();
  }, []);

  const cargarLibros = async () => {
    setCargando(true);
    try {
      const emailUsuario = "roxana.mestres@hotmail.com";
      const respuesta = await fetch(
        "http://localhost:3000/api/libros",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: emailUsuario }),
        }
      );

      if (respuesta.ok) {
        const data = await respuesta.json();
        setLibros(data);
      } else {
        console.error("Error al cargar libros por preferencias");
      }
    } catch (error) {
      console.error("Error al cargar libros por preferencias:", error);
    }
    setCargando(false);
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

  const onIconClick = (icono) => {
    if (icono === "person") {
      setMostrarPopup((prevMostrarPopup) => !prevMostrarPopup);
    } else if (icono === "bookmark") {
      navegar("/listas");
    } else if (icono === "refresh") {
      window.location.reload();
    }
  };

  const handleLinkClick = (ruta) => {
    setMostrarPopup(false);
    navegar(ruta);
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

  return (
    <>
      <NombreBuscador
        className={principal["ocultar-en-movil"]}
        onBusqueda={handleBusqueda}
      />
      {cargando ? (
        <h3 className={principal["cargando"]}>Buscando nuevos libros 👀</h3>
      ) : (
        <SeccionLibros librosGoogleBooks={libros} />
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
      <BotonSubir colorBoton="#252627" />
    </>
  );
}

export default PaginaPerfil;
