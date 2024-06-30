import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContexto } from '../contextos/contextoAuth';

// Componente para proteger rutas
const RutasProtegidas = ({ elemento }) => {
  const { isAuthenticated } = useContext(AuthContexto);

  return isAuthenticated ? elemento : <Navigate to="/iniciar-sesion" />;
};

export default RutasProtegidas;
