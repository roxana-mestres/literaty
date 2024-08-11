import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContexto } from "../contextos/contextoAuth";

const RutaProtegida = ({ children }) => {
  const { isAuthenticated, cargando } = useContext(AuthContexto);

  if (cargando) {
    return <div>Cargando...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/iniciar-sesion" />;
};

export default RutaProtegida;
