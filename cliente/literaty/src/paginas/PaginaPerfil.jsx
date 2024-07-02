import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NombreBuscador from "../componentes/PaginaPerfil/ComponenteNombreBuscador";
import SeccionLibros from "../componentes/PaginaPerfil/ComponenteSeccionLibros";
import BotonSubir from "../componentes/PaginaPerfil/ComponenteBotonSubir";
import Footer from "../componentes/PaginaPerfil/ComponenteFooter";
import principal from "../estilos/PaginaPrincipal.module.css";

function PaginaPerfil() {
  const navegar = useNavigate();
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [emailUsuario, setEmailUsuario] = useState(
    "roxana.mestres@hotmail.com"
  );

  useEffect(() => {
    obtenerLibros();
  }, []);

  const onIconClick = (icono) => {
    if (icono === "person") {
      setMostrarPopup((prevMostrarPopup) => !prevMostrarPopup);
    } else if (icono === "bookmark") {
      navegar("/listas");
    } else if (icono === "refresh") {
      window.location.reload();
    }
  };

  const obtenerLibros = async (intentos = 3) => {
    setCargando(true);
    let data = [];
    for (let i = 0; i < intentos; i++) {
      try {
        const respuesta = await fetch("http://localhost:3000/api/libros", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: emailUsuario }),
        });

        if (respuesta.ok) {
          data = await respuesta.json();

          if (data.length >= 12) {
            break;
          }
        } else {
          console.error("Error al obtener libros");
        }
      } catch (error) {
        console.error("Error al obtener libros:", error);
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    if (data.length < 12) {
      console.warn("No se pudieron obtener 12 libros, se obtuvo:", data.length);
    }

    setLibros(data);
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

  const handleEliminarLibro = async (id) => {
    const emailUsuario = "roxana.mestres@hotmail.com";
    try {
      console.log(`Enviando solicitud DELETE para el libro con ID: ${id}`);
      console.log(`Email del usuario: ${emailUsuario}`);
      const respuesta = await fetch(`http://localhost:3000/api/libros/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailUsuario }),
      });

      if (respuesta.ok) {
        setLibros((prevLibros) =>
          prevLibros.filter((libro) => libro.id !== id)
        );
      } else {
        console.error("Error al eliminar libro");
      }
    } catch (error) {
      console.error("Error al eliminar libro:", error);
    }
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
        />
      )}
      <BotonSubir colorBoton="#252627" />
      <Footer
        iconos={["bookmark", "refresh", "person"]}
        onIconClick={onIconClick}
      />
    </div>
  );
}

export default PaginaPerfil;
