import { useMemo } from 'react'
import { Link, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Referencias from './Referencias'
import OrdenesProduccion from './OrdenesProduccion'
import DocumentacionProduccion from './DocumentacionProduccion'

const liderStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { margin: 0; min-height: 100%; font-family: 'Inter', system-ui, sans-serif; }

  .lider-shell { min-height: 100vh; background: #f0f2f5; color: #0f172a; }
  .lider-header { background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 45%, #4f46e5 100%); padding: 32px 28px; position: relative; overflow: hidden; }
  .lider-header::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at top right, rgba(255,255,255,0.22), transparent 30%); pointer-events:none; }
  .lider-header-inner { position: relative; z-index: 1; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 24px; align-items: flex-start; }
  .lider-header-title { margin: 0; font-size: clamp(2.2rem, 4vw, 3.6rem); line-height: 1.05; font-weight: 800; color: #fff; }
  .lider-header-desc { max-width: 640px; margin: 14px 0 0; color: rgba(255,255,255,0.82); font-size: 1rem; line-height: 1.75; }
  .lider-nav { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 18px; }
  .lider-nav-link { color: rgba(255,255,255,0.85); text-decoration: none; padding: 0.85rem 1.25rem; border-radius: 999px; border: 1px solid rgba(255,255,255,0.16); font-weight: 700; transition: all 0.2s ease; }
  .lider-nav-link.active, .lider-nav-link:hover { background: rgba(255,255,255,0.12); color: #fff; border-color: rgba(255,255,255,0.28); }
  .lider-main { padding: 28px 28px 40px; max-width: 1280px; margin: 0 auto; }
  .lider-intro { background: #fff; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(15,23,42,0.06); border-radius: 22px; padding: 26px 28px; margin-bottom: 24px; }
  .lider-intro h2 { margin: 0 0 10px; font-size: 1.55rem; color: #0f172a; }
  .lider-intro p { margin: 0; color: #475569; line-height: 1.8; }
  .lider-card-grid { display: grid; gap: 18px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lider-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; box-shadow: 0 10px 24px rgba(15,23,42,0.05); transition: transform 0.22s ease, border-color 0.22s ease; }
  .lider-card:hover { transform: translateY(-3px); border-color: #c7d2fe; }
  .lider-card-title { margin: 0 0 10px; font-size: 1.1rem; font-weight: 800; color: #0f172a; }
  .lider-card-desc { margin: 0; color: #475569; line-height: 1.75; }
  .lider-card-cta { margin-top: 18px; display: inline-flex; align-items: center; gap: 8px; font-weight: 700; color: #2563eb; }
  @media (max-width: 960px) { .lider-card-grid { grid-template-columns: 1fr; } }
  @media (max-width: 700px) { .lider-header-inner { flex-direction: column; } }
`

const tabs = [
  { to: 'referencias', label: 'Referencias' },
  { to: 'ordenes', label: 'Órdenes' },
  { to: 'documentacion', label: 'Documentación' },
]

function LiderHome() {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px' }}>
          <div>
            <p style={{ margin: 0, color: '#2563eb', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: '0.8rem' }}>Módulo de Líder</p>
            <h2 style={{ margin: '10px 0 0', fontSize: '2.1rem', lineHeight: 1.05, color: '#0f172a' }}>Supervisión y gestión de producción</h2>
            <p style={{ margin: '18px 0 0', color: '#475569', maxWidth: '680px', lineHeight: 1.8 }}>Desde aquí puedes gestionar el catálogo de referencias, crear y controlar órdenes de producción, y generar documentación estratégica para la operación.</p>
          </div>
        </div>
      </div>

      <div className="lider-card-grid">
        <article className="lider-card">
          <h3 className="lider-card-title">Referencias</h3>
          <p className="lider-card-desc">Administra los productos del catálogo, crea nuevas referencias y mantiene actualizado el inventario técnico.</p>
          <span className="lider-card-cta">Ir a referencias →</span>
        </article>

        <article className="lider-card">
          <h3 className="lider-card-title">Órdenes de producción</h3>
          <p className="lider-card-desc">Crea y controla órdenes vinculadas a pedidos, gestiona prioridades y supervisa los estados de producción.</p>
          <span className="lider-card-cta">Ir a órdenes →</span>
        </article>

        <article className="lider-card">
          <h3 className="lider-card-title">Documentación</h3>
          <p className="lider-card-desc">Genera reportes de seguimiento, resumen de estados y visibilidad sobre la documentación que necesita la gerencia.</p>
          <span className="lider-card-cta">Ir a documentación →</span>
        </article>
      </div>
    </div>
  )
}

export default function LiderProduccionRoutes() {
  const location = useLocation()
  const activeTab = useMemo(() => {
    const path = location.pathname.replace('/lider/', '')
    return tabs.some(tab => tab.to === path) ? path : 'referencias'
  }, [location.pathname])

  return (
    <div className="lider-shell">
      <style>{liderStyles}</style>
      <header className="lider-header">
        <div className="lider-header-inner">
          <div>
            <p style={{ margin: 0, color: '#bfdbfe', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700 }}>Líder de Producción</p>
            <h1 className="lider-header-title">Control centralizado de producción</h1>
            <p className="lider-header-desc">Accede a herramientas de gestión de referencias, creación de órdenes y seguimiento documental desde una sola interfaz profesional.</p>
          </div>
          <div className="lider-nav">
            {tabs.map(tab => (
              <Link key={tab.to} to={tab.to} className={`lider-nav-link${activeTab === tab.to ? ' active' : ''}`}>
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="lider-main">
        <Routes>
          <Route path="/" element={<LiderHome />} />
          <Route path="referencias" element={<Referencias />} />
          <Route path="ordenes" element={<OrdenesProduccion />} />
          <Route path="documentacion" element={<DocumentacionProduccion />} />
          <Route path="*" element={<Navigate to="/lider" />} />
        </Routes>
      </main>
    </div>
  )
}
