import { Routes, Route, Navigate } from 'react-router-dom';

// Páginas existentes (de tus compañeros)
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';

// Páginas del módulo Operario (las que creamos)
import MiPlanilla from '../pages/operario/MiPlanilla';
import RegistrarSellado from '../pages/operario/RegistrarSellado';

// Componente de protección básico (simulación hasta que integren JWT real)
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('user_role');
  
  if (!token || !userRole) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />} />

      {/* ==========================================
          MÓDULO OPERARIO - Tu implementación
          ========================================== */}
      <Route 
        path="/operario/planilla" 
        element={
          <ProtectedRoute allowedRole="operario">
            <MiPlanilla />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/operario/registrar/:id" 
        element={
          <ProtectedRoute allowedRole="operario">
            <RegistrarSellado />
          </ProtectedRoute>
        } 
      />

      {/* Redirección para rutas no definidas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;