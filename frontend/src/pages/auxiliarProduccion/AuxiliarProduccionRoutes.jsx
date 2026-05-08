import { Routes, Route, Link, Navigate } from "react-router-dom";
import {
  Cpu,
  ClipboardList,
  BarChart3,
  Layers,
  Activity,
  Zap,
  ArrowRight,
  Factory,
  CalendarDays,
  ListOrdered,
} from "lucide-react";

import Selladoras from "./Selladoras";
import PlanillasProduccion from "./PlanillasProduccion";
import ReportesTurno from "./ReportesTurno";

const auxiliarStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    margin: 0;
    padding: 0;
    min-height: 100%;
    width: 100%;
    background: #f0f4f8;
    font-family: 'Inter', system-ui, sans-serif;
  }

  body {
    min-height: 100vh;
  }

  .auxiliar-page {
    min-height: 100vh;
    width: 100%;
    padding: 32px 48px 60px;
    background: #f0f4f8;
    font-family: 'Inter', system-ui, sans-serif;
    color: #0f172a;
  }

  /* HEADER */
  .auxiliar-header {
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #0d2550 0%, #1a3a8f 40%, #2152c8 75%, #3b73f5 100%);
    border-radius: 24px;
    margin-bottom: 28px;
    box-shadow:
      0 4px 6px rgba(13, 37, 80, 0.12),
      0 12px 40px rgba(26, 58, 143, 0.35),
      0 32px 64px rgba(26, 58, 143, 0.18),
      inset 0 1px 0 rgba(255,255,255,0.12);
    border: 1px solid rgba(59, 115, 245, 0.4);
  }

  .auxiliar-header-grid {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
    z-index: 0;
  }

  .auxiliar-header-orb1 {
    position: absolute;
    top: -80px;
    right: -60px;
    width: 380px;
    height: 380px;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 40%, rgba(99,179,255,0.22), rgba(59,115,245,0.06) 60%, transparent 80%);
    pointer-events: none;
    z-index: 0;
  }

  .auxiliar-header-orb2 {
    position: absolute;
    bottom: -60px;
    left: 15%;
    width: 240px;
    height: 240px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(147,197,253,0.14), transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .auxiliar-header-shine {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.45) 35%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.45) 65%, transparent 95%);
    z-index: 1;
  }

  .auxiliar-header-bottom-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #60a5fa, #93c5fd, #60a5fa, transparent);
    z-index: 1;
  }

  .auxiliar-header-inner {
    position: relative;
    z-index: 2;
    padding: 36px 44px 32px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 32px;
  }

  .auxiliar-header-left {
    flex: 1;
    min-width: 0;
  }

  .auxiliar-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 9999px;
    padding: 5px 14px 5px 10px;
    font-size: 11px;
    font-weight: 700;
    color: rgba(255,255,255,0.88);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 18px;
    backdrop-filter: blur(4px);
  }

  .auxiliar-badge-dot {
    position: relative;
    width: 8px;
    height: 8px;
    flex-shrink: 0;
  }

  .auxiliar-badge-dot::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: #4ade80;
    animation: auxiliar-ping-dot 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
  }

  .auxiliar-badge-dot::after {
    content: '';
    position: relative;
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4ade80;
  }

  @keyframes auxiliar-ping-dot {
    75%, 100% {
      transform: scale(2);
      opacity: 0;
    }
  }

  .auxiliar-title {
    font-size: 38px;
    font-weight: 800;
    color: #ffffff;
    margin: 0 0 12px;
    letter-spacing: -0.035em;
    line-height: 1.1;
    text-shadow: 0 2px 12px rgba(0,0,0,0.2);
  }

  .auxiliar-title-highlight {
    color: #93c5fd;
    text-shadow: 0 0 32px rgba(147,197,253,0.4);
  }

  .auxiliar-description {
    font-size: 14px;
    color: rgba(255,255,255,0.68);
    margin: 0 0 22px;
    line-height: 1.75;
    max-width: 560px;
  }

  .auxiliar-header-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .auxiliar-header-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.09);
    border: 1px solid rgba(255,255,255,0.16);
    border-radius: 9999px;
    padding: 4px 12px 4px 9px;
    font-size: 11.5px;
    font-weight: 600;
    color: rgba(255,255,255,0.78);
    letter-spacing: 0.01em;
  }

  .auxiliar-header-chip svg {
    color: #93c5fd;
  }

  .auxiliar-header-stats {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex-shrink: 0;
  }

  .auxiliar-header-stat-card {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 14px;
    padding: 12px 18px;
    min-width: 150px;
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    gap: 10px;
    transition: background 0.2s ease;
  }

  .auxiliar-header-stat-card:hover {
    background: rgba(255,255,255,0.13);
  }

  .auxiliar-header-stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 9px;
    background: rgba(255,255,255,0.15);
    color: #93c5fd;
    flex-shrink: 0;
  }

  .auxiliar-header-stat-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .auxiliar-header-stat-label {
    font-size: 10px;
    font-weight: 700;
    color: rgba(255,255,255,0.5);
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }

  .auxiliar-header-stat-value {
    font-size: 15px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.02em;
  }

  /* CONTENT */
  .auxiliar-content {
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .auxiliar-panel {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(15,23,42,0.05), 0 4px 16px rgba(15,23,42,0.04);
    transition: box-shadow 0.2s ease;
  }

  .auxiliar-panel:hover {
    box-shadow: 0 2px 8px rgba(15,23,42,0.08), 0 8px 28px rgba(30,64,175,0.07);
  }

  .auxiliar-panel-head {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 24px;
    background: linear-gradient(to right, #f8faff, #f1f5f9);
    border-bottom: 1px solid #e2e8f0;
  }

  .auxiliar-panel-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: #ffffff;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(37,99,235,0.3);
  }

  .auxiliar-section-title {
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    color: #1e3a5f;
    letter-spacing: -0.01em;
    flex: 1;
  }

  .auxiliar-panel-body {
    padding: 24px;
  }

  .auxiliar-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }

  .auxiliar-card {
    position: relative;
    overflow: hidden;
    display: block;
    min-height: 230px;
    padding: 22px;
    text-decoration: none;
    background: #f8faff;
    border: 1.5px solid #e2e8f0;
    border-radius: 16px;
    color: #0f172a;
    transition: all 0.22s ease;
  }

  .auxiliar-card:hover {
    background: #eff6ff;
    border-color: #bfdbfe;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(37,99,235,0.12);
  }

  .auxiliar-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top right, rgba(37,99,235,0.12), transparent 42%);
    opacity: 0;
    transition: opacity 0.22s ease;
  }

  .auxiliar-card:hover::before {
    opacity: 1;
  }

  .auxiliar-card-content {
    position: relative;
    z-index: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .auxiliar-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 18px;
  }

  .auxiliar-card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    border-radius: 14px;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: #ffffff;
    box-shadow: 0 4px 14px rgba(37,99,235,0.28);
    transition: transform 0.22s ease;
  }

  .auxiliar-card:hover .auxiliar-card-icon {
    transform: scale(1.07);
  }

  .auxiliar-card-tag {
    display: inline-flex;
    align-items: center;
    border-radius: 9999px;
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
    padding: 5px 11px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .auxiliar-card-title {
    margin: 0 0 10px;
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.03em;
  }

  .auxiliar-card-desc {
    margin: 0;
    font-size: 13px;
    line-height: 1.65;
    color: #64748b;
  }

  .auxiliar-card-footer {
    margin-top: auto;
    padding-top: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #1d4ed8;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.01em;
  }

  .auxiliar-card-footer svg {
    transition: transform 0.22s ease;
  }

  .auxiliar-card:hover .auxiliar-card-footer svg {
    transform: translateX(4px);
  }

  .auxiliar-info-panel {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(15,23,42,0.05), 0 4px 16px rgba(15,23,42,0.04);
  }

  .auxiliar-info-body {
    padding: 22px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    flex-wrap: wrap;
  }

  .auxiliar-info-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .auxiliar-info-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    color: #1d4ed8;
    flex-shrink: 0;
  }

  .auxiliar-info-title {
    margin: 0;
    font-size: 14px;
    font-weight: 800;
    color: #0f172a;
  }

  .auxiliar-info-desc {
    margin: 4px 0 0;
    font-size: 13px;
    color: #64748b;
  }

  .auxiliar-status {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: #ecfdf5;
    border: 1px solid #bbf7d0;
    border-radius: 9999px;
    padding: 7px 13px;
    font-size: 12px;
    font-weight: 800;
    color: #16a34a;
    letter-spacing: 0.03em;
  }

  .auxiliar-status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #22c55e;
  }

  @media (max-width: 980px) {
    .auxiliar-page {
      padding: 24px 18px 44px;
    }

    .auxiliar-header-inner {
      flex-direction: column;
      padding: 28px 24px 24px;
    }

    .auxiliar-header-stats {
      flex-direction: row;
      flex-wrap: wrap;
    }

    .auxiliar-header-stat-card {
      min-width: 120px;
      flex: 1;
    }

    .auxiliar-title {
      font-size: 28px;
    }

    .auxiliar-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (min-width: 981px) and (max-width: 1180px) {
    .auxiliar-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
`;

const modules = [
  {
    to: "selladoras",
    icon: Cpu,
    title: "Selladoras",
    description:
      "Gestiona las selladoras existentes, su estado operativo, tipo de sellado y capacidades permitidas.",
    tag: "Equipos",
    cta: "Gestionar selladoras",
  },
  {
    to: "planillas",
    icon: ClipboardList,
    title: "Planillas de producción",
    description:
      "Crea planillas por fecha, turno y selladora. Asigna órdenes, define secuencia y agrupa referencias similares.",
    tag: "Programación",
    cta: "Ver planillas",
  },
  {
    to: "reportes",
    icon: BarChart3,
    title: "Reportes por turno",
    description:
      "Consulta registros de sellado y visualiza el reporte operativo por fecha, turno, selladora y operario.",
    tag: "Reportes",
    cta: "Ver reportes",
  },
];

function AuxiliarProduccionHome() {
  return (
    <div className="auxiliar-page">
      <style>{auxiliarStyles}</style>

      <div className="auxiliar-header">
        <div className="auxiliar-header-grid" />
        <div className="auxiliar-header-orb1" />
        <div className="auxiliar-header-orb2" />
        <div className="auxiliar-header-shine" />
        <div className="auxiliar-header-bottom-bar" />

        <div className="auxiliar-header-inner">
          <div className="auxiliar-header-left">
            <div className="auxiliar-badge">
              <span className="auxiliar-badge-dot" />
              Panel operativo
            </div>

            <h1 className="auxiliar-title">
              Auxiliar de{" "}
              <span className="auxiliar-title-highlight">Producción</span>
            </h1>

            <p className="auxiliar-description">
              Desde este módulo se gestionan las selladoras, las planillas de
              producción, la programación de órdenes y los reportes operativos
              por turno.
            </p>

            <div className="auxiliar-header-chips">
              <span className="auxiliar-header-chip">
                <Cpu size={12} />
                Gestión de selladoras
              </span>

              <span className="auxiliar-header-chip">
                <CalendarDays size={12} />
                Planificación por turno
              </span>

              <span className="auxiliar-header-chip">
                <Layers size={12} />
                Reportes operativos
              </span>
            </div>
          </div>

          <div className="auxiliar-header-stats">
            <div className="auxiliar-header-stat-card">
              <div className="auxiliar-header-stat-icon">
                <Layers size={16} />
              </div>
              <div className="auxiliar-header-stat-info">
                <span className="auxiliar-header-stat-label">Módulos</span>
                <span className="auxiliar-header-stat-value">3</span>
              </div>
            </div>

            <div className="auxiliar-header-stat-card">
              <div className="auxiliar-header-stat-icon">
                <Activity size={16} />
              </div>
              <div className="auxiliar-header-stat-info">
                <span className="auxiliar-header-stat-label">Estado</span>
                <span className="auxiliar-header-stat-value">Activo</span>
              </div>
            </div>

            <div className="auxiliar-header-stat-card">
              <div className="auxiliar-header-stat-icon">
                <Zap size={16} />
              </div>
              <div className="auxiliar-header-stat-info">
                <span className="auxiliar-header-stat-label">Flujo</span>
                <span className="auxiliar-header-stat-value">Producción</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="auxiliar-content">
        <section className="auxiliar-panel">
          <div className="auxiliar-panel-head">
            <div className="auxiliar-panel-icon">
              <Factory size={16} />
            </div>

            <h2 className="auxiliar-section-title">
              Acceso rápido al módulo auxiliar
            </h2>
          </div>

          <div className="auxiliar-panel-body">
            <div className="auxiliar-grid">
              {modules.map((modulo) => {
                const Icono = modulo.icon;

                return (
                  <Link
                    key={modulo.to}
                    to={modulo.to}
                    className="auxiliar-card"
                  >
                    <div className="auxiliar-card-content">
                      <div className="auxiliar-card-top">
                        <div className="auxiliar-card-icon">
                          <Icono size={22} />
                        </div>

                        <span className="auxiliar-card-tag">
                          {modulo.tag}
                        </span>
                      </div>

                      <h3 className="auxiliar-card-title">{modulo.title}</h3>

                      <p className="auxiliar-card-desc">
                        {modulo.description}
                      </p>

                      <div className="auxiliar-card-footer">
                        <span>{modulo.cta}</span>
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="auxiliar-info-panel">
          <div className="auxiliar-info-body">
            <div className="auxiliar-info-left">
              <div className="auxiliar-info-icon">
                <ListOrdered size={18} />
              </div>

              <div>
                <p className="auxiliar-info-title">
                  Flujo del auxiliar de producción
                </p>

                <p className="auxiliar-info-desc">
                  El auxiliar programa órdenes en selladoras mediante planillas
                  y consulta registros para generar reportes por turno.
                </p>
              </div>
            </div>

            <span className="auxiliar-status">
              <span className="auxiliar-status-dot" />
              En línea
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}

function AuxiliarProduccionRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuxiliarProduccionHome />} />
      <Route path="selladoras" element={<Selladoras />} />
      <Route path="planillas" element={<PlanillasProduccion />} />
      <Route path="reportes" element={<ReportesTurno />} />
      <Route path="*" element={<Navigate to="/auxiliar" />} />
    </Routes>
  );
}

export default AuxiliarProduccionRoutes;