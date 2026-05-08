import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Cpu,
  PlusCircle,
  ClipboardList,
  ListOrdered,
  PackagePlus,
  Layers,
  Hash,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  TableProperties,
  Ruler,
  Flame,
  Box,
  SlidersHorizontal,
  Activity,
  Tag,
} from "lucide-react";
import { obtenerSelladoras } from "../../api/selladorasApi";
import { obtenerOrdenesPorProgramar } from "../../api/ordenesApi";
import {
  crearPlanilla,
  obtenerPlanillas,
  obtenerPlanillaPorId,
  agregarTareaPlanilla,
} from "../../api/planillasApi";

const planillasStyles = `
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

  .planillas-page {
    min-height: 100vh;
    width: 100%;
    padding: 32px 48px 60px;
    background: #f0f4f8;
    font-family: 'Inter', system-ui, sans-serif;
    color: #0f172a;
  }

  /* ═══════════════════════════════════════
     HEADER — rico y elaborado
  ═══════════════════════════════════════ */
  .planillas-header {
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #0d2550 0%, #1a3a8f 40%, #2152c8 75%, #3b73f5 100%);
    border-radius: 24px;
    padding: 0;
    margin-bottom: 28px;
    box-shadow:
      0 4px 6px rgba(13, 37, 80, 0.12),
      0 12px 40px rgba(26, 58, 143, 0.35),
      0 32px 64px rgba(26, 58, 143, 0.18),
      inset 0 1px 0 rgba(255,255,255,0.12);
    border: 1px solid rgba(59, 115, 245, 0.4);
  }

  /* Rejilla de puntos decorativa */
  .planillas-header-grid {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
    z-index: 0;
  }

  /* Orbe grande derecho */
  .planillas-header-orb1 {
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

  /* Orbe pequeño izquierdo-bajo */
  .planillas-header-orb2 {
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

  /* Línea de brillo superior */
  .planillas-header-shine {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.45) 35%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.45) 65%, transparent 95%);
    z-index: 1;
  }

  /* Franja inferior de acento */
  .planillas-header-bottom-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #60a5fa, #93c5fd, #60a5fa, transparent);
    z-index: 1;
  }

  /* Contenido interno */
  .planillas-header-inner {
    position: relative;
    z-index: 2;
    padding: 36px 44px 32px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 32px;
  }

  .planillas-header-left {
    flex: 1;
    min-width: 0;
  }

  /* Bloque de stats decorativos */
  .planillas-header-stats {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex-shrink: 0;
  }

  .planillas-header-stat-card {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 14px;
    padding: 12px 18px;
    min-width: 140px;
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    gap: 10px;
    transition: background 0.2s ease;
  }

  .planillas-header-stat-card:hover {
    background: rgba(255,255,255,0.13);
  }

  .planillas-header-stat-icon {
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

  .planillas-header-stat-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .planillas-header-stat-label {
    font-size: 10px;
    font-weight: 700;
    color: rgba(255,255,255,0.5);
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }

  .planillas-header-stat-value {
    font-size: 15px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.02em;
  }

  /* Badge */
  .planillas-badge {
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

  .planillas-badge-dot {
    position: relative;
    width: 8px;
    height: 8px;
    flex-shrink: 0;
  }

  .planillas-badge-dot::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: #4ade80;
    animation: ping-dot 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
  }

  .planillas-badge-dot::after {
    content: '';
    position: relative;
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4ade80;
  }

  @keyframes ping-dot {
    75%, 100% { transform: scale(2); opacity: 0; }
  }

  .planillas-title {
    font-size: 38px;
    font-weight: 800;
    color: #ffffff;
    margin: 0 0 12px;
    letter-spacing: -0.035em;
    line-height: 1.1;
    text-shadow: 0 2px 12px rgba(0,0,0,0.2);
  }

  .planillas-title-highlight {
    color: #93c5fd;
    text-shadow: 0 0 32px rgba(147,197,253,0.4);
  }

  .planillas-description {
    font-size: 14px;
    color: rgba(255,255,255,0.6);
    margin: 0 0 22px;
    line-height: 1.75;
    max-width: 500px;
  }

  /* Chips de info debajo del texto */
  .planillas-header-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .planillas-header-chip {
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

  .planillas-header-chip svg {
    color: #93c5fd;
  }

  @media (max-width: 860px) {
    .planillas-header-inner {
      flex-direction: column;
      padding: 28px 24px 24px;
    }
    .planillas-header-stats {
      flex-direction: row;
      flex-wrap: wrap;
    }
    .planillas-header-stat-card {
      min-width: 120px;
      flex: 1;
    }
    .planillas-title {
      font-size: 28px;
    }
  }

  /* Content */
  .planillas-content {
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  /* Messages */
  .planillas-message {
    margin: 0;
    padding: 13px 18px;
    border-radius: 12px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1d4ed8;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* Panel */
  .planillas-panel {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(15,23,42,0.05), 0 4px 16px rgba(15,23,42,0.04);
    transition: box-shadow 0.2s ease;
  }

  .planillas-panel:hover {
    box-shadow: 0 2px 8px rgba(15,23,42,0.08), 0 8px 28px rgba(30,64,175,0.07);
  }

  .planillas-panel-head {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 24px;
    background: linear-gradient(to right, #f8faff, #f1f5f9);
    border-bottom: 1px solid #e2e8f0;
  }

  .planillas-panel-icon {
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

  .planillas-section-title {
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    color: #1e3a5f;
    letter-spacing: -0.01em;
    flex: 1;
  }

  .planillas-panel-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, #e2e8f0, transparent);
  }

  .planillas-panel-body {
    padding: 24px;
  }

  /* Form */
  .planillas-form {
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 16px;
  }

  .planillas-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
    min-width: 170px;
  }

  .planillas-field-wide {
    min-width: 260px;
    flex: 1;
  }

  .planillas-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }

  .planillas-label svg {
    color: #2563eb;
    flex-shrink: 0;
  }

  .planillas-input,
  .planillas-select {
    width: 100%;
    padding: 10px 13px;
    border: 1.5px solid #cbd5e1;
    border-radius: 10px;
    background: #f8faff;
    color: #0f172a;
    font-size: 13px;
    font-weight: 500;
    font-family: inherit;
    outline: none;
    transition: all 0.2s ease;
  }

  .planillas-input::placeholder {
    color: #94a3b8;
  }

  .planillas-input:focus,
  .planillas-select:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    background: #ffffff;
  }

  .planillas-select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 16px;
    padding-right: 36px;
  }

  .planillas-select option {
    background: #ffffff;
    color: #0f172a;
  }

  /* Buttons */
  .planillas-btn {
    border: none;
    cursor: pointer;
    font-family: inherit;
    padding: 10px 20px;
    border-radius: 10px;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: #ffffff;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.02em;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.28);
    transition: all 0.2s ease;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }

  .planillas-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(37, 99, 235, 0.36);
    background: linear-gradient(135deg, #3b82f6, #2563eb);
  }

  .planillas-btn:active {
    transform: translateY(0);
  }

  .planillas-btn-secondary {
    background: #ffffff;
    border: 1.5px solid #cbd5e1;
    color: #334155;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }

  .planillas-btn-secondary:hover {
    background: #f0f7ff;
    border-color: #2563eb;
    color: #1d4ed8;
    box-shadow: 0 2px 8px rgba(37,99,235,0.12);
  }

  /* Table wrapper */
  .planillas-table-wrap {
    width: 100%;
    overflow-x: auto;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
  }

  .planillas-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    min-width: 920px;
  }

  .planillas-table-wide {
    min-width: 1220px;
  }

  .planillas-table thead tr {
    background: linear-gradient(to right, #f0f7ff, #f8faff);
  }

  .planillas-table th {
    padding: 13px 16px;
    color: #1e40af;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    text-align: left;
    border-bottom: 1px solid #dbeafe;
    white-space: nowrap;
  }

  .planillas-table td {
    padding: 14px 16px;
    font-size: 13px;
    color: #334155;
    border-bottom: 1px solid #f1f5f9;
    background: transparent;
    vertical-align: middle;
    transition: background 0.15s ease;
  }

  .planillas-table tbody tr:last-child td {
    border-bottom: none;
  }

  .planillas-table tbody tr:hover td {
    background: #f0f7ff;
  }

  /* Code badge */
  .planillas-code {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    min-width: 92px;
    padding: 6px 11px;
    background: #eff6ff;
    color: #1d4ed8;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    border: 1px solid #bfdbfe;
  }

  /* Sequence badge */
  .planillas-sequence {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 42px;
    height: 32px;
    background: #eff6ff;
    border: 1.5px solid #bfdbfe;
    color: #1d4ed8;
    border-radius: 8px;
    font-weight: 700;
    font-size: 13px;
  }

  /* Status badge */
  .planillas-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 11px;
    border-radius: 9999px;
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  /* Selected planilla grid */
  .planillas-selected-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(140px, 1fr));
    gap: 14px;
    margin-bottom: 28px;
  }

  .planillas-selected-card {
    background: #f8faff;
    border: 1.5px solid #e2e8f0;
    border-left: 3px solid #2563eb;
    border-radius: 12px;
    padding: 16px 18px;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .planillas-selected-card:hover {
    background: #eff6ff;
    border-color: #bfdbfe;
    border-left-color: #2563eb;
    box-shadow: 0 2px 10px rgba(37,99,235,0.1);
    transform: translateY(-1px);
  }

  .planillas-selected-card-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .planillas-selected-card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    color: #1d4ed8;
    flex-shrink: 0;
  }

  .planillas-selected-label {
    font-size: 11px;
    font-weight: 700;
    color: #94a3b8;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }

  .planillas-selected-value {
    display: block;
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
    padding-left: 2px;
  }

  /* Subtitle */
  .planillas-subtitle {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 28px 0 18px;
    font-size: 14px;
    font-weight: 700;
    color: #1e3a5f;
    letter-spacing: -0.01em;
  }

  .planillas-subtitle-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: #ffffff;
    flex-shrink: 0;
    box-shadow: 0 2px 6px rgba(37,99,235,0.25);
  }

  /* Empty text */
  .planillas-empty-text {
    margin: 0;
    padding: 28px;
    border-radius: 12px;
    background: #f8faff;
    border: 1.5px dashed #bfdbfe;
    color: #94a3b8;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  /* Divider */
  .planillas-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
    margin: 4px 0;
  }

  /* Responsive */
  @media (max-width: 980px) {
    .planillas-page {
      padding: 24px 18px 44px;
    }

    .planillas-header {
      padding: 26px 22px;
    }

    .planillas-title {
      font-size: 26px;
    }

    .planillas-panel-head {
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .planillas-selected-grid {
      grid-template-columns: 1fr 1fr;
    }

    .planillas-form {
      align-items: stretch;
      flex-direction: column;
    }

    .planillas-field,
    .planillas-field-wide {
      width: 100%;
      min-width: 0;
    }
  }

  @media (max-width: 640px) {
    .planillas-selected-grid {
      grid-template-columns: 1fr;
    }
  }
`;

function PlanillasProduccion() {
  const [selladoras, setSelladoras] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [planillas, setPlanillas] = useState([]);
  const [planillaActual, setPlanillaActual] = useState(null);

  const [mensaje, setMensaje] = useState("");

  const [formPlanilla, setFormPlanilla] = useState({
    fecha: "",
    turno: "turno_1",
    selladora_id: "",
  });

  const [formTarea, setFormTarea] = useState({
    orden_produccion_id: "",
    secuencia: 1,
    grupo_similar: "",
  });

  const cargarDatos = async () => {
    try {
      const [selladorasData, ordenesData, planillasData] = await Promise.all([
        obtenerSelladoras(),
        obtenerOrdenesPorProgramar(),
        obtenerPlanillas(),
      ]);
      setSelladoras(selladorasData);
      setOrdenes(ordenesData);
      setPlanillas(planillasData);
    } catch (error) {
      setMensaje("Error cargando datos de programacion");
      console.error(error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cambiarPlanilla = (campo, valor) => {
    setFormPlanilla((prev) => ({ ...prev, [campo]: valor }));
  };

  const cambiarTarea = (campo, valor) => {
    setFormTarea((prev) => ({ ...prev, [campo]: valor }));
  };

  const crearNuevaPlanilla = async (e) => {
    e.preventDefault();
    try {
      setMensaje("");
      const respuesta = await crearPlanilla(formPlanilla);
      setMensaje("Planilla creada correctamente");
      const detalle = await obtenerPlanillaPorId(respuesta.data.id);
      setPlanillaActual(detalle);
      await cargarDatos();
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje || "Error creando planilla de produccion"
      );
      console.error(error);
    }
  };

  const seleccionarPlanilla = async (id) => {
    try {
      const detalle = await obtenerPlanillaPorId(id);
      setPlanillaActual(detalle);
      setMensaje("");
    } catch (error) {
      setMensaje("Error consultando detalle de planilla");
      console.error(error);
    }
  };

  const agregarOrdenAPlanilla = async (e) => {
    e.preventDefault();
    if (!planillaActual) {
      setMensaje("Primero selecciona o crea una planilla");
      return;
    }
    try {
      await agregarTareaPlanilla(planillaActual.id, {
        orden_produccion_id: formTarea.orden_produccion_id,
        secuencia: Number(formTarea.secuencia),
        grupo_similar: formTarea.grupo_similar,
      });
      setMensaje("Orden agregada a la planilla correctamente");
      const detalle = await obtenerPlanillaPorId(planillaActual.id);
      setPlanillaActual(detalle);
      setFormTarea({
        orden_produccion_id: "",
        secuencia: Number(formTarea.secuencia) + 1,
        grupo_similar: "",
      });
      await cargarDatos();
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje || "Error agregando orden a planilla"
      );
      console.error(error);
    }
  };

  return (
    <div className="planillas-page">
      <style>{planillasStyles}</style>

      {/* ── HEADER ── */}
      <div className="planillas-header">
        {/* Capas decorativas */}
        <div className="planillas-header-grid" />
        <div className="planillas-header-orb1" />
        <div className="planillas-header-orb2" />
        <div className="planillas-header-shine" />
        <div className="planillas-header-bottom-bar" />

        <div className="planillas-header-inner">
          {/* Columna izquierda — texto */}
          <div className="planillas-header-left">
            <div className="planillas-badge">
              <span className="planillas-badge-dot" />
              Programacion operativa
            </div>

            <h1 className="planillas-title">
              Planillas de{" "}
              <span className="planillas-title-highlight">Produccion</span>
            </h1>

            <p className="planillas-description">
              En esta pantalla el auxiliar crea planillas por selladora, asigna
              ordenes, define la secuencia y agrupa referencias similares.
            </p>

            {/* Chips de contexto */}
            <div className="planillas-header-chips">
              <span className="planillas-header-chip">
                <Cpu size={12} />
                Gestion de selladoras
              </span>
              <span className="planillas-header-chip">
                <CalendarDays size={12} />
                Planificacion por turno
              </span>
              <span className="planillas-header-chip">
                <Layers size={12} />
                Agrupacion de referencias
              </span>
            </div>
          </div>

          {/* Columna derecha — stat cards decorativas */}
          <div className="planillas-header-stats">
            <div className="planillas-header-stat-card">
              <div className="planillas-header-stat-icon">
                <ClipboardList size={16} />
              </div>
              <div className="planillas-header-stat-info">
                <span className="planillas-header-stat-label">Planillas</span>
                <span className="planillas-header-stat-value">{planillas.length}</span>
              </div>
            </div>

            <div className="planillas-header-stat-card">
              <div className="planillas-header-stat-icon">
                <ListOrdered size={16} />
              </div>
              <div className="planillas-header-stat-info">
                <span className="planillas-header-stat-label">Por programar</span>
                <span className="planillas-header-stat-value">{ordenes.length}</span>
              </div>
            </div>

            <div className="planillas-header-stat-card">
              <div className="planillas-header-stat-icon">
                <Cpu size={16} />
              </div>
              <div className="planillas-header-stat-info">
                <span className="planillas-header-stat-label">Selladoras</span>
                <span className="planillas-header-stat-value">{selladoras.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="planillas-content">
        {/* ── MENSAJE ── */}
        {mensaje && (
          <p className="planillas-message">
            <AlertCircle size={15} />
            {mensaje}
          </p>
        )}

        {/* ── CREAR PLANILLA ── */}
        <section className="planillas-panel">
          <div className="planillas-panel-head">
            <div className="planillas-panel-icon">
              <PlusCircle size={16} />
            </div>
            <h2 className="planillas-section-title">Crear planilla</h2>
          </div>

          <div className="planillas-panel-body">
            <form className="planillas-form" onSubmit={crearNuevaPlanilla}>
              <div className="planillas-field">
                <label className="planillas-label">
                  <CalendarDays size={12} />
                  Fecha
                </label>
                <input
                  className="planillas-input"
                  type="date"
                  value={formPlanilla.fecha}
                  onChange={(e) => cambiarPlanilla("fecha", e.target.value)}
                  required
                />
              </div>

              <div className="planillas-field">
                <label className="planillas-label">
                  <Clock3 size={12} />
                  Turno
                </label>
                <select
                  className="planillas-select"
                  value={formPlanilla.turno}
                  onChange={(e) => cambiarPlanilla("turno", e.target.value)}
                >
                  <option value="turno_1">Turno 1</option>
                  <option value="turno_2">Turno 2</option>
                  <option value="turno_3">Turno 3</option>
                </select>
              </div>

              <div className="planillas-field planillas-field-wide">
                <label className="planillas-label">
                  <Cpu size={12} />
                  Selladora
                </label>
                <select
                  className="planillas-select"
                  value={formPlanilla.selladora_id}
                  onChange={(e) =>
                    cambiarPlanilla("selladora_id", e.target.value)
                  }
                  required
                >
                  <option value="">Seleccione</option>
                  {selladoras.map((selladora) => (
                    <option key={selladora.id} value={selladora.id}>
                      {selladora.codigo} - {selladora.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <button className="planillas-btn" type="submit">
                <PlusCircle size={15} />
                Crear planilla
              </button>
            </form>
          </div>
        </section>

        {/* ── PLANILLAS EXISTENTES ── */}
        <section className="planillas-panel">
          <div className="planillas-panel-head">
            <div className="planillas-panel-icon">
              <ClipboardList size={16} />
            </div>
            <h2 className="planillas-section-title">Planillas existentes</h2>
          </div>

          <div className="planillas-table-wrap">
            <table className="planillas-table">
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Fecha</th>
                  <th>Turno</th>
                  <th>Selladora</th>
                  <th>Estado</th>
                  <th>Accion</th>
                </tr>
              </thead>
              <tbody>
                {planillas.map((planilla) => (
                  <tr key={planilla.id}>
                    <td>
                      <span className="planillas-code">
                        <Hash size={11} />
                        {planilla.codigo_planilla}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#475569" }}>
                        <CalendarDays size={13} color="#2563eb" />
                        {planilla.fecha}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#475569" }}>
                        <Clock3 size={13} color="#2563eb" />
                        {planilla.turno}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#475569" }}>
                        <Cpu size={13} color="#2563eb" />
                        {planilla.selladoras?.nombre}
                      </span>
                    </td>
                    <td>
                      <span className="planillas-status">
                        <Activity size={10} />
                        {planilla.estado_planilla}
                      </span>
                    </td>
                    <td>
                      <button
                        className="planillas-btn planillas-btn-secondary"
                        onClick={() => seleccionarPlanilla(planilla.id)}
                      >
                        <ChevronRight size={14} />
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── PLANILLA SELECCIONADA ── */}
        {planillaActual && (
          <section className="planillas-panel">
            <div className="planillas-panel-head">
              <div className="planillas-panel-icon">
                <TableProperties size={16} />
              </div>
              <h2 className="planillas-section-title">Planilla seleccionada</h2>
            </div>

            <div className="planillas-panel-body">
              {/* Cards de info */}
              <div className="planillas-selected-grid">
                <div className="planillas-selected-card">
                  <div className="planillas-selected-card-header">
                    <div className="planillas-selected-card-icon">
                      <Hash size={13} />
                    </div>
                    <span className="planillas-selected-label">Codigo</span>
                  </div>
                  <span className="planillas-selected-value">
                    {planillaActual.codigo_planilla}
                  </span>
                </div>

                <div className="planillas-selected-card">
                  <div className="planillas-selected-card-header">
                    <div className="planillas-selected-card-icon">
                      <CalendarDays size={13} />
                    </div>
                    <span className="planillas-selected-label">Fecha</span>
                  </div>
                  <span className="planillas-selected-value">
                    {planillaActual.fecha}
                  </span>
                </div>

                <div className="planillas-selected-card">
                  <div className="planillas-selected-card-header">
                    <div className="planillas-selected-card-icon">
                      <Clock3 size={13} />
                    </div>
                    <span className="planillas-selected-label">Turno</span>
                  </div>
                  <span className="planillas-selected-value">
                    {planillaActual.turno}
                  </span>
                </div>

                <div className="planillas-selected-card">
                  <div className="planillas-selected-card-header">
                    <div className="planillas-selected-card-icon">
                      <Cpu size={13} />
                    </div>
                    <span className="planillas-selected-label">Selladora</span>
                  </div>
                  <span className="planillas-selected-value">
                    {planillaActual.selladoras?.nombre}
                  </span>
                </div>
              </div>

              <div className="planillas-divider" />

              {/* Agregar orden */}
              <h3 className="planillas-subtitle">
                <div className="planillas-subtitle-icon">
                  <PackagePlus size={15} />
                </div>
                Agregar orden a la planilla
              </h3>

              <form className="planillas-form" onSubmit={agregarOrdenAPlanilla}>
                <div className="planillas-field planillas-field-wide">
                  <label className="planillas-label">
                    <ListOrdered size={12} />
                    Orden por programar
                  </label>
                  <select
                    className="planillas-select"
                    value={formTarea.orden_produccion_id}
                    onChange={(e) =>
                      cambiarTarea("orden_produccion_id", e.target.value)
                    }
                    required
                  >
                    <option value="">Seleccione</option>
                    {ordenes.map((orden) => (
                      <option key={orden.id} value={orden.id}>
                        {orden.numero_orden} - {orden.nombre_referencia} -
                        Cantidad: {orden.cantidad_programada}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="planillas-field">
                  <label className="planillas-label">
                    <Hash size={12} />
                    Secuencia
                  </label>
                  <input
                    className="planillas-input"
                    type="number"
                    min="1"
                    value={formTarea.secuencia}
                    onChange={(e) => cambiarTarea("secuencia", e.target.value)}
                    required
                  />
                </div>

                <div className="planillas-field">
                  <label className="planillas-label">
                    <Layers size={12} />
                    Grupo similar
                  </label>
                  <input
                    className="planillas-input"
                    value={formTarea.grupo_similar}
                    onChange={(e) =>
                      cambiarTarea("grupo_similar", e.target.value)
                    }
                    placeholder="Ej: Grupo ancho 10"
                  />
                </div>

                <button className="planillas-btn" type="submit">
                  <PackagePlus size={15} />
                  Agregar
                </button>
              </form>

              <div className="planillas-divider" style={{ margin: "24px 0 4px" }} />

              {/* Tareas asignadas */}
              <h3 className="planillas-subtitle">
                <div className="planillas-subtitle-icon">
                  <SlidersHorizontal size={15} />
                </div>
                Tareas asignadas
              </h3>

              {planillaActual.tareas?.length > 0 ? (
                <div className="planillas-table-wrap">
                  <table className="planillas-table planillas-table-wide">
                    <thead>
                      <tr>
                        <th><span style={{ display:"inline-flex", alignItems:"center", gap:5 }}><ListOrdered size={11} />Secuencia</span></th>
                        <th><span style={{ display:"inline-flex", alignItems:"center", gap:5 }}><Hash size={11} />Orden</span></th>
                        <th><span style={{ display:"inline-flex", alignItems:"center", gap:5 }}><Tag size={11} />Referencia</span></th>
                        <th><span style={{ display:"inline-flex", alignItems:"center", gap:5 }}><Box size={11} />Materia prima</span></th>
                        <th><span style={{ display:"inline-flex", alignItems:"center", gap:5 }}><Ruler size={11} />Ancho</span></th>
                        <th><span style={{ display:"inline-flex", alignItems:"center", gap:5 }}><Ruler size={11} />Alto</span></th>
                        <th><span style={{ display:"inline-flex", alignItems:"center", gap:5 }}><SlidersHorizontal size={11} />Calibre</span></th>
                        <th><span style={{ display:"inline-flex", alignItems:"center", gap:5 }}><Flame size={11} />Sellado</span></th>
                        <th><span style={{ display:"inline-flex", alignItems:"center", gap:5 }}><Hash size={11} />Cantidad</span></th>
                        <th><span style={{ display:"inline-flex", alignItems:"center", gap:5 }}><Layers size={11} />Grupo similar</span></th>
                        <th><span style={{ display:"inline-flex", alignItems:"center", gap:5 }}><Activity size={11} />Estado</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {planillaActual.tareas?.map((tarea) => (
                        <tr key={tarea.id}>
                          <td>
                            <span className="planillas-sequence">
                              {tarea.secuencia}
                            </span>
                          </td>
                          <td>{tarea.ordenes_produccion?.numero_orden}</td>
                          <td>
                            {tarea.referencias?.referencia} -{" "}
                            {tarea.referencias?.nombre}
                          </td>
                          <td>{tarea.referencias?.materia_prima}</td>
                          <td>{tarea.referencias?.ancho}</td>
                          <td>{tarea.referencias?.alto}</td>
                          <td>{tarea.referencias?.calibre}</td>
                          <td>{tarea.referencias?.sellado}</td>
                          <td>{tarea.cantidad_programada}</td>
                          <td>{tarea.grupo_similar}</td>
                          <td>
                            <span className="planillas-status">
                              <CheckCircle2 size={10} />
                              {tarea.estado_tarea}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="planillas-empty-text">
                  <ClipboardList size={15} color="#94a3b8" />
                  Esta planilla aun no tiene tareas asignadas.
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default PlanillasProduccion;