import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = ({ rolProhibido }) => {
  const token = localStorage.getItem('token');
  const userRole = (localStorage.getItem('userRole') || '').toUpperCase();

  const estaLogueado = Boolean(token);
  const esRolProhibido = estaLogueado && userRole.includes(rolProhibido.toUpperCase());
  const tieneAcceso = !esRolProhibido;

  return (
    <>
=      {!tieneAcceso && <Navigate to="/" replace />}

=      {tieneAcceso && <Outlet />}
    </>
  );
};