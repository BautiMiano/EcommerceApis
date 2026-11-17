import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { rutaInicioPorRol } from '../../utils/sesion.js';

export const ProtectedRoute = ({ rolesPermitidos, permitirVisitantes = false }) => {
  const { token, rol } = useSelector((state) => state.auth);
  const logueado = Boolean(token);

  if (!logueado) {
    return permitirVisitantes ? <Outlet /> : <Navigate to="/login" replace />;
  }

  if (!rolesPermitidos.includes(rol)) {
    return <Navigate to={rutaInicioPorRol(rol)} replace />;
  }

  return <Outlet />;
};
