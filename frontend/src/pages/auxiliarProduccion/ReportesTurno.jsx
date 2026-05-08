import { useEffect, useState } from "react";
import { obtenerSelladoras } from "../../api/selladorasApi";
import { obtenerReporteTurno } from "../../api/reportesApi";

const reportesStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  html, body, #root {
    margin: 0; padding: 0;
    min-height: 100%; width: 100%;
    background: #f0f4ff;
    font-family: 'Inter', system-ui, sans-serif;
  }

  body { min-height: 100vh; }

  /* ─── PAGE ─── */
  .rp {
    min-height: 100vh;
    width: 100%;
    padding: 36px 52px 72px;
    background: #eef2fc;
    background-image:
      radial-gradient(ellipse 900px 500px at 80% -10%, rgba(59,130,246,0.12) 0%, transparent 70%),
      radial-gradient(ellipse 600px 400px at 10% 90%, rgba(99,102,241,0.08) 0%, transparent 60%);
    font-family: 'Inter', system-ui, sans-serif;
    color: #0f172a;
  }

  /* ─── HEADER ─── */
  .rp-header {
    position: relative;
    overflow: hidden;
    background: #ffffff;
    border: 1px solid rgba(59,130,246,0.15);
    border-radius: 20px;
    padding: 36px 44px;
    margin-bottom: 32px;
    box-shadow: 0 4px 24px rgba(59,130,246,0.08), 0 1px 3px rgba(0,0,0,0.06);
  }

  .rp-header-grid {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 24px;
  }

  .rp-header-deco {
    position: absolute;
    top: 0; right: 0;
    width: 340px; height: 100%;
    background: linear-gradient(135deg, transparent 40%, rgba(59,130,246,0.05) 100%);
    pointer-events: none;
  }

  .rp-header-deco-circles {
    position: absolute;
    top: -60px; right: -60px;
    pointer-events: none;
  }

  .rp-header-deco-circles span {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(59,130,246,0.15);
  }

  .rp-header-deco-circles span:nth-child(1) { width: 200px; height: 200px; top: 0; right: 0; }
  .rp-header-deco-circles span:nth-child(2) { width: 300px; height: 300px; top: -50px; right: -50px; opacity: .5; }
  .rp-header-deco-circles span:nth-child(3) { width: 400px; height: 400px; top: -100px; right: -100px; opacity: .25; }

  .rp-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 999px;
    padding: 5px 14px;
    font-size: 11px;
    font-weight: 700;
    color: #2563eb;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  .rp-badge-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 0 3px rgba(34,197,94,0.2);
    animation: pulse-badge 2s ease infinite;
  }

  @keyframes pulse-badge {
    0%,100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.2); }
    50%      { box-shadow: 0 0 0 6px rgba(34,197,94,0.08); }
  }

  .rp-title {
    font-size: 34px; font-weight: 800;
    color: #0f172a; margin: 0 0 10px;
    letter-spacing: -0.03em; line-height: 1.15;
  }

  .rp-title-highlight {
    color: #2563eb;
    background: linear-gradient(135deg, #2563eb, #6366f1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .rp-desc {
    font-size: 14px; color: #64748b;
    margin: 0; line-height: 1.7; max-width: 620px;
  }

  .rp-header-stats {
    display: flex; gap: 2px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 4px;
    flex-shrink: 0;
  }

  .rp-header-stat {
    padding: 12px 20px;
    border-radius: 10px;
    text-align: center;
    cursor: default;
    transition: background 0.2s;
  }

  .rp-header-stat:hover { background: #fff; }

  .rp-header-stat-value {
    display: block;
    font-size: 22px; font-weight: 800;
    color: #1e40af; letter-spacing: -0.04em;
  }

  .rp-header-stat-label {
    display: block;
    font-size: 10px; font-weight: 700;
    color: #94a3b8; letter-spacing: 0.08em;
    text-transform: uppercase; margin-top: 2px;
  }

  .rp-header-stat-divider {
    width: 1px; background: #e2e8f0;
    margin: 8px 0; align-self: stretch;
  }

  /* ─── CONTENT ─── */
  .rp-content { display: flex; flex-direction: column; gap: 24px; }

  /* ─── PANEL ─── */
  .rp-panel {
    background: #fff;
    border: 1px solid rgba(59,130,246,0.12);
    border-radius: 18px;
    box-shadow: 0 2px 12px rgba(59,130,246,0.06);
    overflow: hidden;
  }

  .rp-panel-head {
    display: flex; align-items: center;
    justify-content: space-between; gap: 18px;
    padding: 18px 24px;
    background: linear-gradient(to right, #f8faff, #fff);
    border-bottom: 1px solid rgba(59,130,246,0.1);
  }

  .rp-section-title {
    display: inline-flex; align-items: center; gap: 10px;
    margin: 0;
    font-size: 11px; font-weight: 700;
    color: #2563eb; letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  .rp-section-title::before {
    content: '';
    width: 8px; height: 8px;
    background: linear-gradient(135deg, #2563eb, #6366f1);
    border-radius: 3px;
  }

  .rp-panel-line {
    flex: 1; height: 1px;
    background: linear-gradient(90deg, rgba(59,130,246,0.2), transparent);
  }

  .rp-panel-body { padding: 24px; }

  /* ─── MESSAGE ─── */
  .rp-message {
    margin: 0; padding: 13px 18px;
    border-radius: 12px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1d4ed8;
    font-size: 13px; font-weight: 600;
    display: flex; align-items: center; gap: 10px;
  }

  .rp-message::before {
    content: 'ℹ';
    width: 22px; height: 22px;
    background: #dbeafe; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-style: normal; font-size: 11px; color: #2563eb;
    flex-shrink: 0;
  }

  /* ─── FORM ─── */
  .rp-form {
    display: flex; align-items: flex-end;
    flex-wrap: wrap; gap: 16px;
  }

  .rp-field {
    display: flex; flex-direction: column; gap: 6px;
    min-width: 160px;
  }

  .rp-field-wide { min-width: 260px; flex: 1; }

  .rp-label {
    font-size: 11px; font-weight: 700;
    color: #64748b; letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .rp-input, .rp-select {
    width: 100%;
    padding: 10px 13px;
    border: 1.5px solid #e2e8f0;
    border-radius: 11px;
    background: #f8fafc;
    color: #0f172a;
    font-size: 13px; font-weight: 500;
    font-family: inherit;
    outline: none;
    transition: all 0.2s ease;
  }

  .rp-input:focus, .rp-select:focus {
    border-color: #3b82f6;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
  }

  .rp-select {
    cursor: pointer; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 16px;
    padding-right: 36px;
  }

  .rp-select option { background: #fff; color: #0f172a; }

  .rp-btn {
    border: none; cursor: pointer;
    font-family: inherit;
    padding: 10px 22px;
    border-radius: 11px;
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    color: #fff;
    font-size: 13px; font-weight: 700;
    letter-spacing: 0.02em;
    box-shadow: 0 4px 14px rgba(37,99,235,0.3);
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .rp-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(37,99,235,0.4);
  }

  .rp-btn:active { transform: translateY(0); }

  /* ─── KPIs ─── */
  .rp-kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(150px, 1fr));
    gap: 16px;
  }

  .rp-kpi-card {
    position: relative; overflow: hidden;
    background: #fff;
    border: 1px solid rgba(59,130,246,0.12);
    border-radius: 18px; padding: 22px 20px;
    box-shadow: 0 2px 12px rgba(59,130,246,0.06);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .rp-kpi-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(37,99,235,0.12);
  }

  .rp-kpi-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #2563eb, #6366f1);
    border-radius: 0 0 18px 18px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .rp-kpi-card:hover::after { opacity: 1; }

  .rp-kpi-icon {
    width: 38px; height: 38px;
    border-radius: 10px;
    background: #eff6ff;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 14px;
    font-size: 18px;
  }

  .rp-kpi-label {
    display: block;
    font-size: 11px; font-weight: 700;
    color: #94a3b8; letter-spacing: 0.08em;
    text-transform: uppercase; margin-bottom: 6px;
  }

  .rp-kpi-value {
    display: block;
    font-size: 34px; font-weight: 800;
    color: #0f172a; letter-spacing: -0.04em;
    line-height: 1;
  }

  .rp-kpi-sub {
    display: block; margin-top: 6px;
    font-size: 12px; color: #94a3b8;
  }

  /* ─── CHARTS GRID ─── */
  .rp-charts-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }

  .rp-chart-card {
    background: #fff;
    border: 1px solid rgba(59,130,246,0.12);
    border-radius: 18px; overflow: hidden;
    box-shadow: 0 2px 12px rgba(59,130,246,0.06);
  }

  .rp-chart-head {
    padding: 18px 22px;
    border-bottom: 1px solid #f1f5f9;
    background: linear-gradient(to right, #f8faff, #fff);
    display: flex; align-items: center; justify-content: space-between;
  }

  .rp-chart-title {
    margin: 0;
    font-size: 12px; font-weight: 700;
    color: #1e40af; letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .rp-chart-body { padding: 22px; }

  /* ─── LOLLIPOP CHART ─── */
  .rp-lollipop { display: flex; flex-direction: column; gap: 14px; }

  .rp-lollipop-row {
    display: grid;
    grid-template-columns: 155px 1fr auto;
    align-items: center; gap: 12px;
  }

  .rp-lollipop-label {
    font-size: 12px; font-weight: 600;
    color: #334155; white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis;
  }

  .rp-lollipop-track {
    position: relative; height: 4px;
    background: #e2e8f0; border-radius: 999px;
  }

  .rp-lollipop-fill {
    position: absolute; left: 0; top: 0;
    height: 100%; border-radius: 999px;
    background: linear-gradient(90deg, #2563eb, #818cf8);
    transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
  }

  .rp-lollipop-dot {
    position: absolute; right: -5px; top: 50%;
    transform: translateY(-50%);
    width: 12px; height: 12px; border-radius: 50%;
    background: #fff;
    border: 3px solid #2563eb;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
  }

  .rp-lollipop-value {
    font-size: 13px; font-weight: 800;
    color: #2563eb; text-align: right;
    font-family: 'DM Mono', monospace;
    min-width: 44px;
  }

  /* ─── WAFFLE CHART ─── */
  .rp-waffle-wrap { display: flex; flex-direction: column; gap: 20px; }

  .rp-waffle-grid {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 3px;
  }

  .rp-waffle-cell {
    aspect-ratio: 1;
    border-radius: 3px;
    background: #e2e8f0;
    transition: transform 0.15s;
  }

  .rp-waffle-cell:hover { transform: scale(1.25); }

  .rp-waffle-legend {
    display: flex; flex-wrap: wrap; gap: 10px;
  }

  .rp-waffle-legend-item {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 600; color: #475569;
  }

  .rp-waffle-legend-dot {
    width: 10px; height: 10px; border-radius: 3px;
  }

  .rp-empty-chart {
    padding: 28px; border-radius: 12px;
    background: #f8fafc;
    border: 1.5px dashed #cbd5e1;
    color: #94a3b8;
    font-size: 13px; font-weight: 600;
    text-align: center;
  }

  /* ─── TABLE ─── */
  .rp-table-wrap { width: 100%; overflow-x: auto; }

  .rp-table {
    width: 100%; border-collapse: separate;
    border-spacing: 0; min-width: 1300px;
  }

  .rp-table thead tr {
    background: linear-gradient(to right, #f0f7ff, #f8f9ff);
  }

  .rp-table th {
    padding: 14px 14px;
    color: #2563eb;
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    text-align: left;
    border-bottom: 2px solid #dbeafe;
    white-space: nowrap;
    position: sticky; top: 0;
    background: #f0f7ff;
  }

  .rp-table td {
    padding: 13px 14px;
    font-size: 13px; color: #1e293b;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
    transition: background 0.15s;
  }

  .rp-table tbody tr:hover td { background: #f0f7ff; }

  .rp-table tbody tr:last-child td { border-bottom: none; }

  /* Badges/chips */
  .rp-chip {
    display: inline-flex; align-items: center;
    justify-content: center;
    padding: 6px 11px;
    border-radius: 7px;
    background: #eff6ff; color: #2563eb;
    border: 1px solid #bfdbfe;
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.04em;
    font-family: 'DM Mono', monospace;
  }

  .rp-selladora-wrap {
    display: inline-flex; align-items: center; gap: 7px;
    font-weight: 600; color: #1e293b;
  }

  .rp-selladora-code {
    display: inline-flex; align-items: center;
    padding: 5px 8px; border-radius: 6px;
    background: #eff6ff; color: #1d4ed8;
    border: 1px solid #bfdbfe;
    font-size: 10px; font-weight: 700;
    font-family: 'DM Mono', monospace;
  }

  .rp-reference { font-weight: 600; color: #0f172a; }

  .rp-qty {
    display: inline-flex; align-items: center;
    justify-content: center;
    min-width: 50px; height: 30px;
    background: #f1f5f9; border: 1px solid #e2e8f0;
    color: #0f172a; border-radius: 7px;
    font-weight: 700; font-size: 13px;
    font-family: 'DM Mono', monospace;
  }

  .rp-status {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 11px; border-radius: 999px;
    background: #eff6ff; color: #2563eb;
    border: 1px solid #bfdbfe;
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.04em; text-transform: uppercase;
    white-space: nowrap;
  }

  .rp-status::before {
    content: ''; width: 5px; height: 5px;
    border-radius: 50%; background: #3b82f6;
    flex-shrink: 0;
  }

  .rp-time {
    display: inline-flex; align-items: center;
    justify-content: center;
    min-width: 72px; padding: 6px 10px;
    border-radius: 7px;
    background: #f1f5f9; border: 1px solid #e2e8f0;
    color: #475569;
    font-size: 12px; font-weight: 700;
    font-family: 'DM Mono', monospace;
  }

  .rp-time-pending {
    background: #fefce8; border-color: #fde68a;
    color: #a16207;
  }

  .rp-empty-text {
    margin: 0; padding: 32px;
    border-radius: 12px;
    background: #f8fafc;
    border: 1.5px dashed #cbd5e1;
    color: #94a3b8;
    font-size: 13px; font-weight: 600;
    text-align: center;
  }

  /* ─── RESPONSIVE ─── */
  @media (max-width: 1100px) {
    .rp-kpi-grid { grid-template-columns: repeat(2, 1fr); }
    .rp-charts-grid { grid-template-columns: 1fr; }
    .rp-header-stats { display: none; }
  }

  @media (max-width: 900px) {
    .rp { padding: 20px 16px 48px; }
    .rp-header { padding: 24px 22px; }
    .rp-title { font-size: 26px; }
    .rp-form { flex-direction: column; align-items: stretch; }
    .rp-field, .rp-field-wide { width: 100%; min-width: 0; }
    .rp-kpi-grid { grid-template-columns: 1fr 1fr; }
    .rp-lollipop-row { grid-template-columns: 1fr; gap: 6px; }
    .rp-lollipop-value { text-align: left; }
  }
`;

// ─── Waffle Chart Colors ───────────────────────────────────
const WAFFLE_COLORS = [
  "#2563eb","#6366f1","#0ea5e9","#8b5cf6","#22d3ee",
  "#38bdf8","#818cf8","#a78bfa","#06b6d4","#7dd3fc",
];

function WaffleChart({ data, total }) {
  if (!data.length) return (
    <p className="rp-empty-chart">Consulta un reporte para ver la gráfica.</p>
  );

  const CELLS = 100;
  const cells = [];
  let filled = 0;

  data.forEach((item, i) => {
    const count = Math.round((item.value / total) * CELLS);
    for (let j = 0; j < count && filled < CELLS; j++, filled++) {
      cells.push(WAFFLE_COLORS[i % WAFFLE_COLORS.length]);
    }
  });

  while (cells.length < CELLS) cells.push("#e2e8f0");

  return (
    <div className="rp-waffle-wrap">
      <div className="rp-waffle-grid">
        {cells.map((color, i) => (
          <div
            key={i}
            className="rp-waffle-cell"
            style={{ background: color }}
          />
        ))}
      </div>
      <div className="rp-waffle-legend">
        {data.map((item, i) => (
          <div className="rp-waffle-legend-item" key={item.label}>
            <span
              className="rp-waffle-legend-dot"
              style={{ background: WAFFLE_COLORS[i % WAFFLE_COLORS.length] }}
            />
            {item.label} ({item.value})
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Spark Donut (SVG inline) ─────────────────────────────
function SparkDonut({ pct, color = "#2563eb" }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r={r} fill="none" stroke="#e2e8f0" strokeWidth="5" />
      <circle
        cx="24" cy="24" r={r}
        fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 24 24)"
      />
    </svg>
  );
}

// ─── KPI icons ────────────────────────────────────────────
const kpiIcons = ["📋","🏭","✅","⏳"];

// ─── Component ────────────────────────────────────────────
function ReportesTurno() {
  const [selladoras, setSelladoras] = useState([]);
  const [reporte, setReporte] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const [filtros, setFiltros] = useState({
    fecha: "",
    turno: "",
    selladora: "",
  });

  const cargarSelladoras = async () => {
    try {
      const data = await obtenerSelladoras();
      setSelladoras(data);
    } catch (error) {
      setMensaje("Error cargando selladoras");
      console.error(error);
    }
  };

  useEffect(() => { cargarSelladoras(); }, []);

  const cambiarFiltro = (campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  const consultarReporte = async (e) => {
    e.preventDefault();
    try {
      setMensaje("");
      const filtrosLimpios = Object.fromEntries(
        Object.entries(filtros).filter(([, v]) => v !== "")
      );
      const data = await obtenerReporteTurno(filtrosLimpios);
      setReporte(data);
      if (data.length === 0)
        setMensaje("No hay registros para los filtros seleccionados");
    } catch (error) {
      setMensaje("Error consultando reporte por turno");
      console.error(error);
    }
  };

  // ─── KPIs ─────────────────────────────────────────────
  const totalRegistros      = reporte.length;
  const totalProducido      = reporte.reduce((t, i) => t + Number(i.cantidad_bolsas_producidas || 0), 0);
  const registrosFinalizados= reporte.filter((i) => i.hora_fin).length;
  const registrosPendientes = reporte.filter((i) => !i.hora_fin).length;

  const finalizadosPct = totalRegistros
    ? Math.round((registrosFinalizados / totalRegistros) * 100)
    : 0;

  // ─── Charts data ──────────────────────────────────────
  const produccionPorSelladora = Object.values(
    reporte.reduce((acc, item) => {
      const key = item.codigo_selladora || "Sin codigo";
      if (!acc[key]) acc[key] = {
        label: `${item.codigo_selladora || "S/C"} - ${item.selladora || "Sin selladora"}`,
        value: 0,
      };
      acc[key].value += Number(item.cantidad_bolsas_producidas || 0);
      return acc;
    }, {})
  ).sort((a, b) => b.value - a.value);

  const registrosPorEstado = Object.values(
    reporte.reduce((acc, item) => {
      const key = item.estado_registro || "Sin estado";
      if (!acc[key]) acc[key] = { label: key, value: 0 };
      acc[key].value += 1;
      return acc;
    }, {})
  ).sort((a, b) => b.value - a.value);

  const maxProd = Math.max(...produccionPorSelladora.map((i) => i.value), 0) || 1;

  return (
    <div className="rp">
      <style>{reportesStyles}</style>

      {/* ── HEADER ── */}
      <div className="rp-header">
        <div className="rp-header-deco" />
        <div className="rp-header-deco-circles">
          <span /><span /><span />
        </div>

        <div className="rp-header-grid">
          <div>
            <div className="rp-badge">
              <span className="rp-badge-dot" />
              Reporte operativo
            </div>
            <h1 className="rp-title">
              Reporte por <span className="rp-title-highlight">Turno</span>
            </h1>
            <p className="rp-desc">
              Consulta los registros de sellado y genera el reporte operativo filtrado
              por fecha, turno y selladora.
            </p>
          </div>

          <div className="rp-header-stats">
            <div className="rp-header-stat">
              <span className="rp-header-stat-value">{totalRegistros}</span>
              <span className="rp-header-stat-label">Registros</span>
            </div>
            <div className="rp-header-stat-divider" />
            <div className="rp-header-stat">
              <span className="rp-header-stat-value">{totalProducido.toLocaleString()}</span>
              <span className="rp-header-stat-label">Bolsas</span>
            </div>
            <div className="rp-header-stat-divider" />
            <div className="rp-header-stat">
              <SparkDonut pct={finalizadosPct} color="#2563eb" />
              <span className="rp-header-stat-label">{finalizadosPct}% fin.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rp-content">

        {/* ── FILTERS ── */}
        <section className="rp-panel">
          <div className="rp-panel-head">
            <h2 className="rp-section-title">Filtros de consulta</h2>
            <span className="rp-panel-line" />
          </div>
          <div className="rp-panel-body">
            <form className="rp-form" onSubmit={consultarReporte}>
              <div className="rp-field">
                <label className="rp-label">Fecha</label>
                <input
                  className="rp-input" type="date"
                  value={filtros.fecha}
                  onChange={(e) => cambiarFiltro("fecha", e.target.value)}
                />
              </div>

              <div className="rp-field">
                <label className="rp-label">Turno</label>
                <select
                  className="rp-select"
                  value={filtros.turno}
                  onChange={(e) => cambiarFiltro("turno", e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="turno_1">Turno 1</option>
                  <option value="turno_2">Turno 2</option>
                  <option value="turno_3">Turno 3</option>
                </select>
              </div>

              <div className="rp-field rp-field-wide">
                <label className="rp-label">Selladora</label>
                <select
                  className="rp-select"
                  value={filtros.selladora}
                  onChange={(e) => cambiarFiltro("selladora", e.target.value)}
                >
                  <option value="">Todas</option>
                  {selladoras.map((s) => (
                    <option key={s.id} value={s.codigo}>
                      {s.codigo} - {s.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <button className="rp-btn" type="submit">
                Consultar →
              </button>
            </form>
          </div>
        </section>

        {/* ── MESSAGE ── */}
        {mensaje && <p className="rp-message">{mensaje}</p>}

        {/* ── KPIs ── */}
        <section className="rp-kpi-grid">
          {[
            { label: "Registros",  value: totalRegistros,       sub: "Filas consultadas",     icon: kpiIcons[0] },
            { label: "Producción", value: totalProducido.toLocaleString(), sub: "Bolsas producidas", icon: kpiIcons[1] },
            { label: "Finalizados",value: registrosFinalizados,  sub: "Con hora de fin",       icon: kpiIcons[2] },
            { label: "Pendientes", value: registrosPendientes,   sub: "Sin finalizar",         icon: kpiIcons[3] },
          ].map((kpi) => (
            <div className="rp-kpi-card" key={kpi.label}>
              <div className="rp-kpi-icon">{kpi.icon}</div>
              <span className="rp-kpi-label">{kpi.label}</span>
              <span className="rp-kpi-value">{kpi.value}</span>
              <span className="rp-kpi-sub">{kpi.sub}</span>
            </div>
          ))}
        </section>

        {/* ── CHARTS ── */}
        <section className="rp-charts-grid">

          {/* Lollipop: producción por selladora */}
          <div className="rp-chart-card">
            <div className="rp-chart-head">
              <h3 className="rp-chart-title">Producción por selladora</h3>
              <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>
                Bolsas
              </span>
            </div>
            <div className="rp-chart-body">
              {produccionPorSelladora.length > 0 ? (
                <div className="rp-lollipop">
                  {produccionPorSelladora.map((item) => (
                    <div className="rp-lollipop-row" key={item.label}>
                      <span className="rp-lollipop-label">{item.label}</span>
                      <div className="rp-lollipop-track">
                        <div
                          className="rp-lollipop-fill"
                          style={{ width: `${(item.value / maxProd) * 100}%` }}
                        />
                        <span className="rp-lollipop-dot" />
                      </div>
                      <span className="rp-lollipop-value">
                        {item.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rp-empty-chart">
                  Consulta un reporte para generar la gráfica.
                </p>
              )}
            </div>
          </div>

          {/* Waffle: registros por estado */}
          <div className="rp-chart-card">
            <div className="rp-chart-head">
              <h3 className="rp-chart-title">Registros por estado</h3>
              <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>
                100 celdas = 100%
              </span>
            </div>
            <div className="rp-chart-body">
              <WaffleChart
                data={registrosPorEstado}
                total={totalRegistros || 1}
              />
            </div>
          </div>

        </section>

        {/* ── TABLE ── */}
        <section className="rp-panel">
          <div className="rp-panel-head">
            <h2 className="rp-section-title">Resultados del turno</h2>
            <span className="rp-panel-line" />
            {reporte.length > 0 && (
              <span style={{
                fontSize: 11, fontWeight: 700, color: "#64748b",
                background: "#f1f5f9", border: "1px solid #e2e8f0",
                borderRadius: 999, padding: "4px 12px",
                whiteSpace: "nowrap",
              }}>
                {reporte.length} registros
              </span>
            )}
          </div>

          {reporte.length > 0 ? (
            <div className="rp-table-wrap">
              <table className="rp-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Turno</th>
                    <th>Selladora</th>
                    <th>Operario</th>
                    <th>Orden</th>
                    <th>Pedido</th>
                    <th>Referencia</th>
                    <th>Rollo</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Cant. producida</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {reporte.map((item) => (
                    <tr key={item.registro_id}>
                      <td>{item.fecha}</td>
                      <td><span className="rp-status">{item.turno}</span></td>
                      <td>
                        <span className="rp-selladora-wrap">
                          <span className="rp-selladora-code">{item.codigo_selladora}</span>
                          {item.selladora}
                        </span>
                      </td>
                      <td>{item.operario}</td>
                      <td><span className="rp-chip">{item.numero_orden}</span></td>
                      <td>{item.numero_pedido}</td>
                      <td>
                        <span className="rp-reference">
                          {item.referencia} - {item.nombre_referencia}
                        </span>
                      </td>
                      <td>{item.codigo_rollo}</td>
                      <td><span className="rp-time">{item.hora_inicio}</span></td>
                      <td>
                        <span className={`rp-time ${!item.hora_fin ? "rp-time-pending" : ""}`}>
                          {item.hora_fin || "Pendiente"}
                        </span>
                      </td>
                      <td>
                        <span className="rp-qty">
                          {item.cantidad_bolsas_producidas || 0}
                        </span>
                      </td>
                      <td><span className="rp-status">{item.estado_registro}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rp-panel-body">
              <p className="rp-empty-text">
                Consulta un reporte para visualizar los registros operativos del turno.
              </p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default ReportesTurno;