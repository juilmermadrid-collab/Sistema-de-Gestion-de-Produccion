import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";

import AuxiliarProduccionRoutes from "../pages/auxiliarProduccion/AuxiliarProduccionRoutes";
import LiderProduccionRoutes from "../pages/liderProduccion/LiderProduccionRoutes";
import VendedorRoutes from "../pages/vendedor/VendedorRoutes";
import OperarioRoutes from "../pages/operario/OperarioRoutes";
import ModuleSelection from "../pages/ModuleSelection";

const appRoutesStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .app-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    padding: 0 40px;
    height: 62px;
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(16px) saturate(1.6);
    -webkit-backdrop-filter: blur(16px) saturate(1.6);
    border-bottom: 1px solid rgba(59, 130, 246, 0.12);
    box-shadow:
      0 1px 3px rgba(59,130,246,0.06),
      0 4px 16px rgba(37,99,235,0.05);
    font-family: 'Inter', system-ui, sans-serif;
  }
    

  .app-nav::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent 5%, #2563eb 35%, #6366f1 50%, #2563eb 65%, transparent 95%);
    opacity: 0.7;
  }

  .app-nav-inner {
    height: 100%;
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .app-nav-back {
    display: inline-flex; align-items: center; gap: 9px;
    text-decoration: none;
    background: #f0f7ff;
    border: 1.5px solid #bfdbfe;
    border-radius: 10px;
    padding: 8px 16px;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13px; font-weight: 600;
    color: #1d4ed8;
    transition: all 0.22s ease;
  }

  .app-nav-back:hover {
    background: #dbeafe;
    border-color: #93c5fd;
    transform: translateX(-2px);
    box-shadow: 0 3px 10px rgba(37,99,235,0.15);
  }

  .app-nav-back-icon {
    display: flex; align-items: center; justify-content: center;
    width: 24px; height: 24px;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    border-radius: 6px; color: #fff;
    transition: transform 0.22s ease;
    flex-shrink: 0;
  }

  .app-nav-back:hover .app-nav-back-icon {
    transform: translateX(-2px);
  }

  .app-nav-back-icon svg {
    width: 13px; height: 13px;
  }

  .app-nav-logo {
    display: flex; align-items: center; gap: 11px;
  }

  .app-nav-logo-icon {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    border-radius: 10px;
    box-shadow: 0 3px 10px rgba(37,99,235,0.28);
  }

  .app-nav-logo-icon svg {
    width: 18px; height: 18px; color: #fff;
  }

  .app-nav-logo-text {
    font-size: 14px; font-weight: 800;
    color: #0f172a; letter-spacing: -0.02em;
  }

  .app-nav-logo-text span {
    color: #2563eb;
  }

  .app-nav-logo-divider {
    width: 1px; height: 20px;
    background: #e2e8f0;
    margin: 0 4px;
  }

  .app-nav-logo-sub {
    font-size: 11px; font-weight: 600;
    color: #94a3b8; letter-spacing: 0.06em;
    text-transform: uppercase;
    font-family: 'DM Mono', monospace;
  }

  .app-nav-status {
    display: inline-flex; align-items: center; gap: 8px;
    background: #ecfdf5;
    border: 1px solid #bbf7d0;
    border-radius: 999px;
    padding: 6px 14px;
    font-size: 12px; font-weight: 700;
    color: #16a34a; letter-spacing: 0.02em;
  }

  .app-nav-status-dot {
    position: relative; width: 8px; height: 8px; flex-shrink: 0;
  }

  .app-nav-status-dot::before {
    content: ''; position: absolute; inset: 0;
    border-radius: 50%; background: #22c55e;
    animation: nav-ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
  }

  .app-nav-status-dot::after {
    content: ''; relative; display: block;
    width: 8px; height: 8px; border-radius: 50%; background: #22c55e;
  }

  @keyframes nav-ping {
    75%, 100% { transform: scale(2); opacity: 0; }
  }

  @media (max-width: 640px) {
    .app-nav { padding: 0 16px; }
    .app-nav-logo { display: none; }
    .app-nav-logo-divider { display: none; }
    .app-nav-logo-sub { display: none; }
  }
`;

function AppLayout() {
  const location = useLocation();

  const ocultarBarra = location.pathname === "/";

  const moduleLabel = () => {
    if (location.pathname.startsWith("/auxiliar")) return "Auxiliar de Producción";
    if (location.pathname.startsWith("/lider")) return "Líder de Producción";
    if (location.pathname.startsWith("/vendedor")) return "Vendedor";
    if (location.pathname.startsWith("/operario")) return "Operario";
    return "Sistema de Producción";
  };

  return (
    <>
      <style>{appRoutesStyles}</style>

      {!ocultarBarra && (
        <nav className="app-nav">
          <div className="app-nav-inner">
            <Link to="/" className="app-nav-back">
              <span className="app-nav-back-icon">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </span>
              Volver al inicio
            </Link>

            <div className="app-nav-logo">
              <div className="app-nav-logo-icon">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>

              <span className="app-nav-logo-text">
                {moduleLabel()}
              </span>

              <div className="app-nav-logo-divider" />
              <span className="app-nav-logo-sub">v1.0</span>
            </div>

            <div className="app-nav-status">
              <span className="app-nav-status-dot" />
              En línea
            </div>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<ModuleSelection />} />
        <Route path="/auxiliar/*" element={<AuxiliarProduccionRoutes />} />
        <Route path="/lider/*" element={<LiderProduccionRoutes />} />
        <Route path="/vendedor/*" element={<VendedorRoutes />} />
        <Route path="/operario/*" element={<OperarioRoutes />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default AppRoutes;