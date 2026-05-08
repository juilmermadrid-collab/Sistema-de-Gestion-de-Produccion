import { useEffect, useState } from "react";
import {
  Cpu,
  Save,
  AlertCircle,
  Loader2,
  Factory,
  Settings2,
  Activity,
  ShieldCheck,
  Hash,
  ToggleLeft,
  ToggleRight,
  Wrench,
  Layers,
  CheckCircle2,
} from "lucide-react";
import {
  obtenerSelladoras,
  actualizarSelladora,
} from "../../api/selladorasApi";

const selladorasStyles = `
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

  .selladoras-page {
    min-height: 100vh;
    width: 100%;
    padding: 32px 48px 60px;
    background: #f0f4f8;
    font-family: 'Inter', system-ui, sans-serif;
    color: #0f172a;
  }

  /* HEADER DIFERENTE AL DE PLANILLAS */
  .selladoras-header {
    position: relative;
    overflow: hidden;
    background:
      linear-gradient(135deg, rgba(13,37,80,0.98) 0%, rgba(26,58,143,0.96) 48%, rgba(37,99,235,0.94) 100%);
    border-radius: 26px;
    margin-bottom: 28px;
    min-height: 260px;
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
    border: 1px solid rgba(59, 115, 245, 0.45);
    box-shadow:
      0 4px 6px rgba(13, 37, 80, 0.12),
      0 12px 40px rgba(26, 58, 143, 0.35),
      0 32px 64px rgba(26, 58, 143, 0.18),
      inset 0 1px 0 rgba(255,255,255,0.12);
  }

  .selladoras-header::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(0deg, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 46px 46px;
    mask-image: linear-gradient(to right, rgba(0,0,0,0.8), transparent 78%);
    pointer-events: none;
    z-index: 0;
  }

  .selladoras-header::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #60a5fa, #93c5fd, #60a5fa, transparent);
    z-index: 2;
  }

  .selladoras-header-glow {
    position: absolute;
    right: -90px;
    top: -90px;
    width: 420px;
    height: 420px;
    border-radius: 9999px;
    background: radial-gradient(circle, rgba(147,197,253,0.24), rgba(59,130,246,0.08) 55%, transparent 72%);
    z-index: 0;
    pointer-events: none;
  }

  .selladoras-header-left {
    position: relative;
    z-index: 2;
    padding: 38px 44px 34px;
  }

  .selladoras-header-right {
    position: relative;
    z-index: 2;
    padding: 30px 34px 30px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .selladoras-badge {
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

  .selladoras-badge-dot {
    position: relative;
    width: 8px;
    height: 8px;
    flex-shrink: 0;
  }

  .selladoras-badge-dot::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: #4ade80;
    animation: selladoras-ping-dot 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
  }

  .selladoras-badge-dot::after {
    content: '';
    position: relative;
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4ade80;
  }

  @keyframes selladoras-ping-dot {
    75%, 100% {
      transform: scale(2);
      opacity: 0;
    }
  }

  .selladoras-title {
    font-size: 38px;
    font-weight: 800;
    color: #ffffff;
    margin: 0 0 12px;
    letter-spacing: -0.035em;
    line-height: 1.1;
    text-shadow: 0 2px 12px rgba(0,0,0,0.2);
  }

  .selladoras-title-highlight {
    color: #93c5fd;
    text-shadow: 0 0 32px rgba(147,197,253,0.4);
  }

  .selladoras-description {
    font-size: 14px;
    color: rgba(255,255,255,0.68);
    margin: 0 0 22px;
    line-height: 1.75;
    max-width: 560px;
  }

  .selladoras-header-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .selladoras-header-chip {
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

  .selladoras-header-chip svg {
    color: #93c5fd;
  }

  /* TARJETA VISUAL DEL HEADER */
  .selladoras-machine-card {
    width: 100%;
    max-width: 310px;
    border-radius: 22px;
    background: rgba(255,255,255,0.09);
    border: 1px solid rgba(255,255,255,0.15);
    backdrop-filter: blur(10px);
    padding: 20px;
    box-shadow: 0 20px 50px rgba(15,23,42,0.22);
  }

  .selladoras-machine-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
  }

  .selladoras-machine-icon {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    background: rgba(255,255,255,0.14);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #bfdbfe;
  }

  .selladoras-machine-status {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(34, 197, 94, 0.14);
    border: 1px solid rgba(34, 197, 94, 0.25);
    border-radius: 9999px;
    padding: 6px 11px;
    font-size: 11px;
    font-weight: 800;
    color: #86efac;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .selladoras-machine-status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #4ade80;
  }

  .selladoras-machine-title {
    margin: 0 0 6px;
    font-size: 16px;
    font-weight: 800;
    color: #ffffff;
  }

  .selladoras-machine-subtitle {
    margin: 0 0 18px;
    font-size: 12.5px;
    line-height: 1.55;
    color: rgba(255,255,255,0.62);
  }

  .selladoras-machine-metrics {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .selladoras-machine-metric {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 14px;
    padding: 12px;
  }

  .selladoras-machine-metric-label {
    display: block;
    font-size: 10px;
    font-weight: 700;
    color: rgba(255,255,255,0.48);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 5px;
  }

  .selladoras-machine-metric-value {
    display: block;
    font-size: 17px;
    font-weight: 800;
    color: #ffffff;
  }

  /* CONTENT */
  .selladoras-content {
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .selladoras-message {
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

  .selladoras-loading {
    margin: 0;
    padding: 13px 18px;
    border-radius: 12px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    color: #475569;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .selladoras-loading svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* PANEL */
  .selladoras-panel {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(15,23,42,0.05), 0 4px 16px rgba(15,23,42,0.04);
    transition: box-shadow 0.2s ease;
  }

  .selladoras-panel:hover {
    box-shadow: 0 2px 8px rgba(15,23,42,0.08), 0 8px 28px rgba(30,64,175,0.07);
  }

  .selladoras-panel-head {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 24px;
    background: linear-gradient(to right, #f8faff, #f1f5f9);
    border-bottom: 1px solid #e2e8f0;
  }

  .selladoras-panel-icon {
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

  .selladoras-section-title {
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    color: #1e3a5f;
    letter-spacing: -0.01em;
    flex: 1;
  }

  .selladoras-panel-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, #e2e8f0, transparent);
  }

  /* TABLE */
  .selladoras-table-wrap {
    width: 100%;
    overflow-x: auto;
  }

  .selladoras-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    min-width: 980px;
  }

  .selladoras-table thead tr {
    background: linear-gradient(to right, #f0f7ff, #f8faff);
  }

  .selladoras-table th {
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

  .selladoras-table td {
    padding: 14px 16px;
    font-size: 13px;
    color: #334155;
    border-bottom: 1px solid #f1f5f9;
    background: transparent;
    vertical-align: middle;
    transition: background 0.15s ease;
  }

  .selladoras-table tbody tr:last-child td {
    border-bottom: none;
  }

  .selladoras-table tbody tr:hover td {
    background: #f0f7ff;
  }

  .selladoras-code {
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

  .selladoras-number {
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

  .selladoras-input,
  .selladoras-select {
    width: 100%;
    min-width: 150px;
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

  .selladoras-input::placeholder {
    color: #94a3b8;
  }

  .selladoras-input:focus,
  .selladoras-select:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    background: #ffffff;
  }

  .selladoras-select {
    cursor: pointer;
    min-width: 120px;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 16px;
    padding-right: 36px;
  }

  .selladoras-select option {
    background: #ffffff;
    color: #0f172a;
  }

  .selladoras-checkbox-cell {
    text-align: center;
  }

  .selladoras-checkbox {
    appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 6px;
    border: 2px solid #cbd5e1;
    background: #ffffff;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;
  }

  .selladoras-checkbox:hover {
    border-color: #2563eb;
  }

  .selladoras-checkbox:checked {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }

  .selladoras-checkbox:checked::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 6px;
    width: 6px;
    height: 11px;
    border: solid #ffffff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  .selladoras-action-cell {
    text-align: right;
  }

  .selladoras-save-btn {
    border: none;
    cursor: pointer;
    font-family: inherit;
    padding: 10px 18px;
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

  .selladoras-save-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(37, 99, 235, 0.36);
    background: linear-gradient(135deg, #3b82f6, #2563eb);
  }

  .selladoras-save-btn:active {
    transform: translateY(0);
  }

  .selladoras-status-badge {
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

  @media (max-width: 980px) {
    .selladoras-page {
      padding: 24px 18px 44px;
    }

    .selladoras-header {
      grid-template-columns: 1fr;
    }

    .selladoras-header-left {
      padding: 28px 24px 10px;
    }

    .selladoras-header-right {
      padding: 0 24px 24px;
      justify-content: flex-start;
    }

    .selladoras-title {
      font-size: 28px;
    }

    .selladoras-panel-head {
      align-items: flex-start;
      flex-wrap: wrap;
    }
  }
`;

function Selladoras() {
  const [selladoras, setSelladoras] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cargarSelladoras = async () => {
    try {
      setCargando(true);
      const data = await obtenerSelladoras();
      setSelladoras(data);
    } catch (error) {
      setMensaje("Error cargando selladoras");
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSelladoras();
  }, []);

  const cambiarCampo = (id, campo, valor) => {
    setSelladoras((prev) =>
      prev.map((selladora) =>
        selladora.id === id ? { ...selladora, [campo]: valor } : selladora
      )
    );
  };

  const guardarSelladora = async (selladora) => {
    try {
      setMensaje("");

      await actualizarSelladora(selladora.id, {
        nombre: selladora.nombre,
        sellado_fondo: selladora.sellado_fondo,
        sellado_lateral: selladora.sellado_lateral,
        tipos_referencia_permitidos:
          selladora.tipos_referencia_permitidos_texto ||
          selladora.tipos_referencia_permitidos,
        estado: selladora.estado,
      });

      setMensaje("Selladora actualizada correctamente");
      cargarSelladoras();
    } catch (error) {
      setMensaje("Error actualizando selladora");
      console.error(error);
    }
  };

  const activas = selladoras.filter((selladora) => selladora.estado === "activa").length;
  const conSelladoFondo = selladoras.filter((selladora) => selladora.sellado_fondo).length;

  return (
    <div className="selladoras-page">
      <style>{selladorasStyles}</style>

      <div className="selladoras-header">
        <div className="selladoras-header-glow" />

        <div className="selladoras-header-left">
          <div className="selladoras-badge">
            <span className="selladoras-badge-dot" />
            Control de equipos
          </div>

          <h1 className="selladoras-title">
            Gestión de{" "}
            <span className="selladoras-title-highlight">Selladoras</span>
          </h1>

          <p className="selladoras-description">
            En esta pantalla el auxiliar de producción gestiona las selladoras
            existentes, sus capacidades operativas, los tipos de referencia
            permitidos y el estado actual de cada equipo.
          </p>

          <div className="selladoras-header-chips">
            <span className="selladoras-header-chip">
              <Cpu size={12} />
              Equipos de sellado
            </span>

            <span className="selladoras-header-chip">
              <Settings2 size={12} />
              Capacidades operativas
            </span>

            <span className="selladoras-header-chip">
              <ShieldCheck size={12} />
              Estado de disponibilidad
            </span>
          </div>
        </div>

        <div className="selladoras-header-right">
          <div className="selladoras-machine-card">
            <div className="selladoras-machine-top">
              <div className="selladoras-machine-icon">
                <Factory size={24} />
              </div>

              <span className="selladoras-machine-status">
                <span className="selladoras-machine-status-dot" />
                En línea
              </span>
            </div>

            <p className="selladoras-machine-title">
              Panel de capacidad instalada
            </p>

            <p className="selladoras-machine-subtitle">
              Vista rápida del estado actual de las selladoras registradas para
              programación de producción.
            </p>

            <div className="selladoras-machine-metrics">
              <div className="selladoras-machine-metric">
                <span className="selladoras-machine-metric-label">
                  Selladoras
                </span>
                <span className="selladoras-machine-metric-value">
                  {selladoras.length}
                </span>
              </div>

              <div className="selladoras-machine-metric">
                <span className="selladoras-machine-metric-label">
                  Activas
                </span>
                <span className="selladoras-machine-metric-value">
                  {activas}
                </span>
              </div>

              <div className="selladoras-machine-metric">
                <span className="selladoras-machine-metric-label">
                  Fondo
                </span>
                <span className="selladoras-machine-metric-value">
                  {conSelladoFondo}
                </span>
              </div>

              <div className="selladoras-machine-metric">
                <span className="selladoras-machine-metric-label">
                  Módulo
                </span>
                <span className="selladoras-machine-metric-value">
                  AP
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="selladoras-content">
        {mensaje && (
          <p className="selladoras-message">
            <AlertCircle size={15} />
            {mensaje}
          </p>
        )}

        {cargando && (
          <p className="selladoras-loading">
            <Loader2 size={15} />
            Cargando selladoras...
          </p>
        )}

        <div className="selladoras-panel">
          <div className="selladoras-panel-head">
            <div className="selladoras-panel-icon">
              <Wrench size={16} />
            </div>

            <h2 className="selladoras-section-title">
              Inventario operativo de selladoras
            </h2>

            <span className="selladoras-panel-line" />
          </div>

          <div className="selladoras-table-wrap">
            <table className="selladoras-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Número</th>
                  <th>Sellado fondo</th>
                  <th>Sellado lateral</th>
                  <th>Tipos permitidos</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>

              <tbody>
                {selladoras.map((selladora) => (
                  <tr key={selladora.id}>
                    <td>
                      <span className="selladoras-code">
                        <Hash size={11} />
                        {selladora.codigo}
                      </span>
                    </td>

                    <td>
                      <input
                        className="selladoras-input"
                        value={selladora.nombre || ""}
                        onChange={(e) =>
                          cambiarCampo(
                            selladora.id,
                            "nombre",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <span className="selladoras-number">
                        {selladora.numero}
                      </span>
                    </td>

                    <td className="selladoras-checkbox-cell">
                      <input
                        className="selladoras-checkbox"
                        type="checkbox"
                        checked={!!selladora.sellado_fondo}
                        onChange={(e) =>
                          cambiarCampo(
                            selladora.id,
                            "sellado_fondo",
                            e.target.checked
                          )
                        }
                      />
                    </td>

                    <td className="selladoras-checkbox-cell">
                      <input
                        className="selladoras-checkbox"
                        type="checkbox"
                        checked={!!selladora.sellado_lateral}
                        onChange={(e) =>
                          cambiarCampo(
                            selladora.id,
                            "sellado_lateral",
                            e.target.checked
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        className="selladoras-input"
                        value={
                          selladora.tipos_referencia_permitidos_texto ??
                          (Array.isArray(
                            selladora.tipos_referencia_permitidos
                          )
                            ? selladora.tipos_referencia_permitidos.join(", ")
                            : "")
                        }
                        onChange={(e) =>
                          cambiarCampo(
                            selladora.id,
                            "tipos_referencia_permitidos_texto",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <select
                        className="selladoras-select"
                        value={selladora.estado}
                        onChange={(e) =>
                          cambiarCampo(
                            selladora.id,
                            "estado",
                            e.target.value
                          )
                        }
                      >
                        <option value="activa">Activa</option>
                        <option value="inactiva">Inactiva</option>
                      </select>
                    </td>

                    <td className="selladoras-action-cell">
                      <button
                        className="selladoras-save-btn"
                        onClick={() => guardarSelladora(selladora)}
                      >
                        <Save size={14} />
                        Guardar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Selladoras;