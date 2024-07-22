import React, { useState } from "react";
import estilosEditarPerfil from "../estilos/EditarPerfil.module.css";
import estilos from "../estilos/Comunes.module.css";
import ComponenteEditarPerfil from "../componentes/PaginaEditarPerfil/ComponenteEditarPerfil";
import { useUsuario } from "../contextos/contextoUsuario";
import avatar0 from "../assets/avatar-0.svg";
import avatar1 from "../assets/avatar-1.svg";
import avatar2 from "../assets/avatar-2.svg";
import avatar3 from "../assets/avatar-3.svg";
import avatar4 from "../assets/avatar-4.svg";
import avatar5 from "../assets/avatar-5.svg";

function PaginaEditarPerfil() {
  const { usuario: dataUsuario, actualizarDataUsuario } = useUsuario();
  console.log("Estos son los datos del usuario - dataUsuario: ", dataUsuario);
  const titulo = "Editar perfil";
  const [contrasenaActual, setContrasenaActual] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [contrasenaRepetida, setContrasenaRepetida] = useState("");

  const handleCambioInput = (campo, valor) => {
    actualizarDataUsuario({ ...dataUsuario, [campo]: valor });
  };

  const handleGuardarCambios = async () => {
    if (!dataUsuario._id) {
      console.error("No se encontró el ID del usuario en dataUsuario");
      return;
    }
  
    if (contrasena === contrasenaRepetida) {
      try {
        const token = localStorage.getItem("token");
        const respuesta = await fetch(
          `http://localhost:3000/api/usuario/actualizar/${dataUsuario._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...dataUsuario,
              contrasenaActual,
              contrasena,
            }),
          }
        );
  
        if (!respuesta.ok) {
          throw new Error("Error al actualizar el usuario");
        }
  
        const usuarioActualizado = await respuesta.json();
        actualizarDataUsuario(usuarioActualizado);
        setContrasena("");
        setContrasenaRepetida("");
        setContrasenaActual("");
      } catch (error) {
        console.error("Error al actualizar el usuario:", error);
      }
    } else {
      console.log("Las contraseñas no coinciden.");
    }
  };  

  const avatares = {
    0: avatar0,
    1: avatar1,
    2: avatar2,
    3: avatar3,
    4: avatar4,
    5: avatar5,
  };

  const contenidoPersonalizado = (
    <div className={estilosEditarPerfil["div-tarjeta"]}>
      <div
        className={`${estilosEditarPerfil["celda"]} ${estilosEditarPerfil["celda-dos"]}`}
      >
        <div className={estilosEditarPerfil["borde-avatar"]}>
          <div className={estilosEditarPerfil["avatar-contenedor"]}>
            <img
              src={avatares[dataUsuario.avatar]}
              alt="avatar"
              className={estilosEditarPerfil["avatar"]}
            />
          </div>
        </div>
      </div>
      <div
        className={`${estilosEditarPerfil["celda"]} ${estilosEditarPerfil["celda-dos"]}`}
      ></div>
      <div
        className={`${estilosEditarPerfil["celda"]} ${estilosEditarPerfil["celda-tres"]}`}
      >
        <div>
          <p>
            <b>Nombre:</b>
          </p>
          <input
            type="text"
            value={dataUsuario && dataUsuario.nombre ? dataUsuario.nombre : ""}
            onChange={(e) => handleCambioInput("nombre", e.target.value)}
          />
        </div>
      </div>
      <div
        className={`${estilosEditarPerfil["celda"]} ${estilosEditarPerfil["celda-cuatro"]}`}
      >
      </div>
      <div
        className={`${estilosEditarPerfil["celda"]} ${estilosEditarPerfil["celda-ancho-completo"]} ${estilosEditarPerfil["celda-cinco"]}`}
      >
        <div className={`${estilosEditarPerfil["correo"]}`}>
          <p>
            <b>Correo electrónico:</b>
          </p>
          <input
            type="email"
            value={dataUsuario && dataUsuario.email ? dataUsuario.email : ""}
            onChange={(e) => handleCambioInput("email", e.target.value)}
          />
        </div>
      </div>
      <div
        className={`${estilosEditarPerfil["celda"]} ${estilosEditarPerfil["celda-ancho-completo"]} ${estilosEditarPerfil["celda-seis"]}`}
      >
        <div className={`${estilosEditarPerfil["div-contrasenas-container"]}`}>
          <div className={`${estilosEditarPerfil["div-contrasenas"]}`}>
            <p>
              <b>Contraseña actual:</b>
            </p>
            <input
              type="password"
              value={contrasenaActual}
              onChange={(e) => setContrasenaActual(e.target.value)}
            />
          </div>
          <div className={`${estilosEditarPerfil["div-contrasenas"]}`}>
            <p>
              <b>Nueva contraseña:</b>
            </p>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </div>
          <div className={`${estilosEditarPerfil["div-contrasenas"]}`}>
            <p>
              <b>Confirmar nueva contraseña:</b>
            </p>
            <input
              type="password"
              value={contrasenaRepetida}
              onChange={(e) => setContrasenaRepetida(e.target.value)}
            />
          </div>
        </div>
        <button
          className={`${estilos["boton"]} ${estilosEditarPerfil["boton-actualizar"]}`}
          onClick={handleGuardarCambios}
        >
          Actualizar
        </button>
      </div>
    </div>
  );  

  return (
    <div>
      <ComponenteEditarPerfil
        contenidoPersonalizado={contenidoPersonalizado}
        titulo={titulo}
        claseContenido={estilosEditarPerfil["contenido-editar-perfil"]}
        guardarCambios={handleGuardarCambios}
        dataUsuario={dataUsuario}
        onCambioInput={handleCambioInput}
        actualizarDataUsuario={actualizarDataUsuario}
        onGuardar={handleGuardarCambios}
      />
    </div>
  );
}

export default PaginaEditarPerfil;
