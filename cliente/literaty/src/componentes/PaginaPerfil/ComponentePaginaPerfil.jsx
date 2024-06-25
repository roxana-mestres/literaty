import React from "react";
import { useNavigate } from "react-router-dom";

const ComponentePerfil = () => {

  const navegar = useNavigate();

  const handleCerrarSesion = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/cerrar-sesion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await respuesta.json();
      if (respuesta.status === 200) {
        console.log("Sesión cerrada exitosamente");
        navegar("/");
      } else {
        console.error("Error al cerrar sesión:", data.message);
      }
    } catch (error) {
      console.error("Error al conectarse con el servidor:", error);
    }
  };
  
  return (
    <>
    <h1>Perfil</h1>
    <button onClick={handleCerrarSesion}>Cerrar sesión</button>
    </>
  );
};

export default ComponentePerfil;