import { Routes, Route, Navigate, Link } from "react-router-dom";
import MiPlanilla from "./MiPlanilla";
import RegistrarSellado from "./RegistrarSellado";

const operarioHomeStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  body, html, #root { margin: 0; min-height: 100%; font-family: 'Inter', system-ui, sans-serif; }
  .operario-home { min-height: 100vh; background: #eef2ff; padding: 32px 24px 44px; }
  .operario-home-inner { max-width: 1120px; margin: 0 auto; }
  .operario-header { margin-bottom: 28px; }
  .operario-title { margin: 0 0 10px; font-size: clamp(2rem, 3vw, 3.4rem); line-height: 1.05; }
  .operario-description { margin: 0; color: #475569; line-height: 1.8; max-width: 720px; }
  .operario-grid { display: grid; gap: 18px; grid-template-columns: repeat(2, minmax(240px, 1fr)); }
  .operario-card { padding: 24px; border-radius: 22px; background: #ffffff; border: 1px solid #dbeafe; box-shadow: 0 16px 28px rgba(15,23,42,0.06); text-decoration: none; color: inherit; transition: transform 0.2s ease, border-color 0.2s ease; }
  .operario-card:hover { transform: translateY(-3px); border-color: #93c5fd; }
  .operario-card-title { margin: 0 0 10px; font-size: 1.1rem; font-weight: 700; }
  .operario-card-text { margin: 0; color: #475569; line-height: 1.75; }
  @media (max-width: 800px) { .operario-grid { grid-template-columns: 1fr; } }
`;

function OperarioHome() {
  return (
    <div className="operario-home">
      <style>{operarioHomeStyles}</style>
      <div className="operario-home-inner">
        <header className="operario-header">
          <h1 className="operario-title">Módulo de Operario</h1>
          <p className="operario-description">
            Accede a tus planillas y registra el sellado de cada turno desde aquí.
          </p>
        </header>

        <div className="operario-grid">
          <Link to="mi-planilla" className="operario-card">
            <h2 className="operario-card-title">Mi planilla</h2>
            <p className="operario-card-text">Consulta los datos de tu planilla diaria y el estado de tus tareas.</p>
          </Link>
          <Link to="registrar" className="operario-card">
            <h2 className="operario-card-title">Registrar sellado</h2>
            <p className="operario-card-text">Registra cada ciclo de sellado y mantén los registros operativos al día.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OperarioRoutes() {
  return (
    <Routes>
      <Route path="/" element={<OperarioHome />} />
      <Route path="mi-planilla" element={<MiPlanilla />} />
      <Route path="registrar" element={<RegistrarSellado />} />
      <Route path="*" element={<Navigate to="/operario" />} />
    </Routes>
  );
}
