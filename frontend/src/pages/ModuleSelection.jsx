import { Link } from "react-router-dom";
import { Cpu, Layers, ShoppingCart, UserCheck } from "lucide-react";

const moduleSelectionStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }
  body, html, #root { margin: 0; min-height: 100%; font-family: 'Inter', system-ui, sans-serif; }

  .module-selection {
    min-height: 100vh;
    background: radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 28%),
      radial-gradient(circle at bottom right, rgba(99,102,241,0.14), transparent 34%),
      #f8fafc;
    color: #0f172a;
    padding: 32px 24px 48px;
  }

  .module-selection-inner {
    max-width: 1180px;
    margin: 0 auto;
  }

  .module-selection-header {
    display: grid;
    gap: 22px;
    margin-bottom: 32px;
  }

  .module-selection-title {
    font-size: clamp(2.5rem, 4vw, 4.2rem);
    line-height: 1.02;
    margin: 0;
  }

  .module-selection-subtitle {
    max-width: 720px;
    font-size: 1rem;
    color: #475569;
    line-height: 1.8;
    margin: 0;
  }

  .module-selection-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(220px, 1fr));
    gap: 20px;
  }

  .module-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 240px;
    border-radius: 24px;
    padding: 28px;
    background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
    border: 1px solid rgba(59,130,246,0.12);
    box-shadow: 0 18px 40px rgba(15,23,42,0.08);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    text-decoration: none;
  }

  .module-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 56px rgba(15,23,42,0.14);
  }

  .module-card-icon {
    width: 54px;
    height: 54px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, #2563eb, #6366f1);
    color: #fff;
    margin-bottom: 22px;
  }

  .module-card-title {
    margin: 0 0 10px;
    font-size: 1.1rem;
    font-weight: 800;
    color: #0f172a;
  }

  .module-card-desc {
    margin: 0;
    color: #475569;
    line-height: 1.75;
    font-size: 0.95rem;
  }

  .module-card-cta {
    margin-top: 22px;
    font-size: 0.9rem;
    font-weight: 700;
    color: #2563eb;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  @media (max-width: 1024px) {
    .module-selection-grid {
      grid-template-columns: repeat(2, minmax(220px, 1fr));
    }
  }

  @media (max-width: 680px) {
    .module-selection-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const modules = [
  {
    title: "Auxiliar de Producción",
    description: "Gestiona selladoras, planillas de producción y reportes operativos por turno.",
    icon: <Cpu size={24} />,
    path: "/auxiliar",
    cta: "Entrar al módulo",
  },
  {
    title: "Líder de Producción",
    description: "Supervisa órdenes, documentación y referencias de producción.",
    icon: <Layers size={24} />,
    path: "/lider",
    cta: "Entrar al módulo",
  },
  {
    title: "Vendedor",
    description: "Crea pedidos, revisa referencias y administra pedidos por cliente.",
    icon: <ShoppingCart size={24} />,
    path: "/vendedor",
    cta: "Entrar al módulo",
  },
  {
    title: "Operario",
    description: "Registra sellado y revisa tus planillas de producción diarias.",
    icon: <UserCheck size={24} />,
    path: "/operario",
    cta: "Entrar al módulo",
  },
];

export default function ModuleSelection() {
  return (
    <div className="module-selection">
      <style>{moduleSelectionStyles}</style>
      <div className="module-selection-inner">
        <header className="module-selection-header">
          <div>
            <p style={{ color: '#2563eb', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Panel de Módulos
            </p>
            <h1 className="module-selection-title">Accede a tu módulo de trabajo</h1>
            <p className="module-selection-subtitle">
              Selecciona el módulo que corresponde a tu rol para ingresar al sistema. Cada módulo tiene su propia interfaz de gestión especializada.
            </p>
          </div>
        </header>

        <div className="module-selection-grid">
          {modules.map((mod) => (
            <Link key={mod.path} to={mod.path} className="module-card">
              <div className="module-card-icon">{mod.icon}</div>
              <h2 className="module-card-title">{mod.title}</h2>
              <p className="module-card-desc">{mod.description}</p>
              <span className="module-card-cta">{mod.cta} →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
