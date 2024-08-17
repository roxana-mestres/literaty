import React, { useState, useEffect, useContext } from "react";
import estilosEditarPerfil from "../estilos/EditarPerfil.module.css";
import ComponenteEditarPerfil from "../componentes/PaginaEditarPerfil/ComponenteEditarPerfil";
import { useUsuario } from "../contextos/contextoUsuario";
import {AuthContexto} from "../contextos/contextoAuth";
import avatar0 from "../assets/avatar-0.svg";
import avatar1 from "../assets/avatar-1.svg";
import avatar2 from "../assets/avatar-2.svg";
import avatar3 from "../assets/avatar-3.svg";
import avatar4 from "../assets/avatar-4.svg";
import avatar5 from "../assets/avatar-5.svg";

function PaginaEditarPerfil() {
  const { usuario: dataUsuario, actualizarDataUsuario } = useUsuario();
  console.log("Estos son los datos del usuario - dataUsuario: ", dataUsuario);
  const { renovarToken } = useContext(AuthContexto);
  const titulo = "Editar perfil";
  const [contrasenaActual, setContrasenaActual] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [contrasenaRepetida, setContrasenaRepetida] = useState("");
  const [indiceAvatar, setIndiceAvatar] = useState(dataUsuario.avatar || 0);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const avatares = [avatar0, avatar1, avatar2, avatar3, avatar4, avatar5];
  const [nombreOriginal, setNombreOriginal] = useState(dataUsuario.nombre);
  const [emailOriginal, setEmailOriginal] = useState(dataUsuario.email);

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
    const usuarioId = dataUsuario._id;
    const nuevasAlertas = [];
  
    if (dataUsuario.nombre !== nombreOriginal || dataUsuario.email !== emailOriginal) {
      nuevasAlertas.push("Los cambios en el perfil han sido guardados correctamente.");
    }
  
    if (contrasena && contrasenaActual && contrasena === contrasenaRepetida) {
      const contrasenaValida = validarContrasena(contrasena);
      if (!contrasenaValida) {
        alert("La nueva contraseña no cumple con los requisitos.");
        return;
      }
  
      try {
        let respuestaContrasena = await fetch(
          `https://literaty-backend.onrender.com/api/usuario/actualizar-contrasena/${usuarioId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contrasenaActual,
              contrasena,
            }),
            credentials: "include",
          }
        );
  
        if (respuestaContrasena.status === 401) {
          const tokenRenovado = await renovarToken();
          if (tokenRenovado) {
            respuestaContrasena = await fetch(
              `https://literaty-backend.onrender.com/api/usuario/actualizar-contrasena/${usuarioId}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  contrasenaActual,
                  contrasena,
                }),
                credentials: "include",
              }
            );
          } else {
            alert("Error al renovar el token. Por favor, inicie sesión nuevamente.");
            return;
          }
        }
  
        if (!respuestaContrasena.ok) {
          const errorData = await respuestaContrasena.json();
          throw new Error(errorData.mensaje || "Error al actualizar la contraseña");
        }
  
        nuevasAlertas.push("La contraseña ha sido actualizada correctamente.");
      } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        alert("Hubo un problema al actualizar la contraseña.");
        return;
      }
  
      setContrasena("");
      setContrasenaRepetida("");
      setContrasenaActual("");
    }
  
    try {
      let respuestaPerfil = await fetch(
        `https://literaty-backend.onrender.com/api/usuario/actualizar/${usuarioId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...dataUsuario,
            avatar: indiceAvatar,
          }),
          credentials: "include",
        }
      );
  
      if (respuestaPerfil.status === 401) {
        const tokenRenovado = await renovarToken();
        if (tokenRenovado) {
          respuestaPerfil = await fetch(
            `https://literaty-backend.onrender.com/api/usuario/actualizar/${usuarioId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...dataUsuario,
                avatar: indiceAvatar,
              }),
              credentials: "include",
            }
          );
        } else {
          alert("Error al renovar el token. Por favor, inicie sesión nuevamente.");
          return;
        }
      }
  
      if (!respuestaPerfil.ok) {
        throw new Error("Error al actualizar el usuario");
      }
  
      const usuarioActualizado = await respuestaPerfil.json();
      actualizarDataUsuario(usuarioActualizado);
      setNombreOriginal(usuarioActualizado.nombre);
      setEmailOriginal(usuarioActualizado.email);
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      alert("Hubo un problema al actualizar el perfil.");
      return;
    }
  
    if (nuevasAlertas.length > 0) {
      alert(nuevasAlertas.join("\n"));
    }
  };

  const validarContrasena = (contrasena) => {
    const regexContrasena =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
    const esValida = regexContrasena.test(contrasena);
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
        <div className={`${estilosEditarPerfil["nombre"]}`}>
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
            className={`${estilosEditarPerfil["correo-input"]}`}
          />
        </div>
      </div>
      <div
        className={`${estilosEditarPerfil["celda"]} ${estilosEditarPerfil["celda-ancho-completo"]} ${estilosEditarPerfil["celda-seis"]}`}
      >
        <div className={`${estilosEditarPerfil["div-contrasenas-container"]}`}>
          <div className={`${estilosEditarPerfil["div-contrasenas"]}`}>
            <p className={`${estilosEditarPerfil["p-contrasena"]}`}>
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
              ></button>
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
                <span className="material-symbols-outlined">
                  {mostrarContrasena ? "visibility_off" : "visibility"}
                </span>
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
              ></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <ComponenteEditarPerfil
        contenidoPersonalizado={contenidoPersonalizado}
        titulo={titulo}
        claseContenido={estilosEditarPerfil["contenido-editar-perfil"]}
        dataUsuario={dataUsuario}
        onCambioInput={handleCambioInput}
        actualizarDataUsuario={actualizarDataUsuario}
        onGuardar={handleGuardarCambios}
      />
    </div>
  );
}

export default PaginaEditarPerfil;
