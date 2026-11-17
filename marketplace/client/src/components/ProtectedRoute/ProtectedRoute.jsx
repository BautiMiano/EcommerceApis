import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { rutaInicioPorRol } from '../../utils/sesion.js';

// Deja pasar solo a los roles indicados. Los visitantes pasan únicamente si permitirVisitantes es true;
// si no, van al login. Un rol sin permiso vuelve a su propio inicio.
// Es solo para la navegación: los permisos reales los valida el backend.
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
