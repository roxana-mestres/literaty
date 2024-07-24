import React, { useState, useEffect } from "react";
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
  const [indiceAvatar, setIndiceAvatar] = useState(dataUsuario.avatar || 0);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const avatares = [avatar0, avatar1, avatar2, avatar3, avatar4, avatar5];

  useEffect(() => {
    setIndiceAvatar(dataUsuario.avatar || 0);
  }, [dataUsuario.avatar]);

  const cambiarAvatar = () => {
    setIndiceAvatar((prevIndice) => (prevIndice + 1) % avatares.length);
  };

  const toggleMostrarContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  const handleCambioInput = (campo, valor) => {
    actualizarDataUsuario({ ...dataUsuario, [campo]: valor });
  };

  const handleGuardarCambios = async () => {
    const usuarioId = "668e5211621febe6145303b4";

    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/usuario/actualizar/${usuarioId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...dataUsuario,
            contrasenaActual,
            contrasena,
            avatar: indiceAvatar,
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
  };

  const handleActualizarContrasena = async () => {
    if (contrasena !== contrasenaRepetida) {
        alert("Las contraseñas nuevas no coinciden.");
        console.log("Las contraseñas nuevas no coinciden.");
        return;
    }

    if (contrasena && !validarContrasena(contrasena)) {
        alert("La nueva contraseña no cumple con los requisitos.");
        console.log("La nueva contraseña no cumple con los requisitos.");
        return;
    }

    const usuarioId = "668e5211621febe6145303b4";

    try {
        console.log("Enviando petición para actualizar la contraseña...");
        const respuesta = await fetch(
            `http://localhost:3000/api/usuario/actualizar-contrasena/${usuarioId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contrasenaActual,
                    contrasena,
                }),
            }
        );

        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            console.log("Respuesta no OK:", errorData);
            throw new Error(errorData.mensaje || "Error al actualizar la contraseña");
        }

        setContrasena("");
        setContrasenaRepetida("");
        setContrasenaActual("");

        alert("La contraseña ha sido actualizada correctamente.");
        console.log("La contraseña ha sido actualizada correctamente.");
    } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        alert("Hubo un problema al actualizar la contraseña.");
    }
};

const validarContrasena = (password) => {
    const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
    const esValida = regexContrasena.test(password);
    console.log("Contraseña válida:", esValida);
    return esValida;
};

  const contenidoPersonalizado = (
    <div className={estilosEditarPerfil["div-tarjeta"]}>
      <div
        className={`${estilosEditarPerfil["celda"]} ${estilosEditarPerfil["celda-dos"]}`}
      >
        <div className={estilosEditarPerfil["borde-avatar"]}>
          <div
            className={estilosEditarPerfil["avatar-contenedor"]}
            onClick={cambiarAvatar}
          >
            <img
              src={avatares[indiceAvatar]}
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
      ></div>
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
            <div className={`${estilosEditarPerfil["input-container"]}`}>
              <input
                type={mostrarContrasena ? "text" : "password"}
                value={contrasenaActual}
                onChange={(e) => setContrasenaActual(e.target.value)}
              />
              <button
                type="button"
                onClick={toggleMostrarContrasena}
                className={estilosEditarPerfil["mostrar-contrasena"]}
              >
                {mostrarContrasena ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>
          <div className={`${estilosEditarPerfil["div-contrasenas"]}`}>
            <p>
              <b>Nueva contraseña:</b>
            </p>
            <div className={`${estilosEditarPerfil["input-container"]}`}>
              <input
                type={mostrarContrasena ? "text" : "password"}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
              <button
                type="button"
                onClick={toggleMostrarContrasena}
                className={estilosEditarPerfil["mostrar-contrasena"]}
              >
                {mostrarContrasena ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>
          <div className={`${estilosEditarPerfil["div-contrasenas"]}`}>
            <p>
              <b>Confirmar nueva contraseña:</b>
            </p>
            <div className={`${estilosEditarPerfil["input-container"]}`}>
              <input
                type={mostrarContrasena ? "text" : "password"}
                value={contrasenaRepetida}
                onChange={(e) => setContrasenaRepetida(e.target.value)}
              />
              <button
                type="button"
                onClick={toggleMostrarContrasena}
                className={estilosEditarPerfil["mostrar-contrasena"]}
              >
                {mostrarContrasena ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>
        </div>
        <button
          className={`${estilos["boton"]} ${estilosEditarPerfil["boton-actualizar"]}`}
          onClick={handleActualizarContrasena}
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
