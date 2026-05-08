import { Routes, Route, Link, Navigate } from "react-router-dom";
import BuscarReferencias from "./BuscarReferencias";
import CrearPedido from "./CrearPedido";
import MisPedidos from "./MisPedidos";

const vendedorHomeStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  body, html, #root { margin: 0; min-height: 100%; font-family: 'Inter', system-ui, sans-serif; }
  .vendedor-home { min-height: 100vh; background: #f8fafc; padding: 30px 24px 40px; }
  .vendedor-home-inner { max-width: 1180px; margin: 0 auto; }
  .vendedor-home-panel { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 32px; box-shadow: 0 16px 30px rgba(15,23,42,0.06); }
  .vendedor-home-title { margin: 0 0 12px; font-size: clamp(2rem, 3vw, 3rem); line-height: 1.05; }
  .vendedor-home-text { color: #475569; line-height: 1.8; margin: 0 0 28px; }
  .vendedor-card-grid { display: grid; gap: 18px; grid-template-columns: repeat(3, minmax(220px, 1fr)); }
  .vendedor-card { background: #f8fbff; border: 1px solid #dbeafe; border-radius: 20px; padding: 24px; text-decoration: none; color: inherit; transition: transform 0.22s ease, border-color 0.22s ease; }
  .vendedor-card:hover { transform: translateY(-3px); border-color: #93c5fd; }
  .vendedor-card-title { margin: 0 0 10px; font-size: 1.05rem; font-weight: 700; }
  .vendedor-card-desc { margin: 0; color: #475569; line-height: 1.65; }
  @media (max-width: 920px) { .vendedor-card-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 640px) { .vendedor-card-grid { grid-template-columns: 1fr; } }
`;

function VendedorHome() {
  return (
    <div className="vendedor-home">
      <style>{vendedorHomeStyles}</style>
      <div className="vendedor-home-inner">
        <div className="vendedor-home-panel">
          <h1 className="vendedor-home-title">Bienvenido al módulo de Vendedor</h1>
          <p className="vendedor-home-text">
            Puedes buscar referencias, crear pedidos y consultar tus pedidos existentes.
          </p>
          <div className="vendedor-card-grid">
            <Link to="buscar" className="vendedor-card">
              <h2 className="vendedor-card-title">Buscar referencias</h2>
              <p className="vendedor-card-desc">Explora el catálogo de referencias para agregar productos al pedido.</p>
            </Link>
            <Link to="crear" className="vendedor-card">
              <h2 className="vendedor-card-title">Crear pedido</h2>
              <p className="vendedor-card-desc">Inicia un nuevo pedido con los artículos seleccionados y datos del cliente.</p>
            </Link>
            <Link to="pedidos" className="vendedor-card">
              <h2 className="vendedor-card-title">Mis pedidos</h2>
              <p className="vendedor-card-desc">Revisa el estado y los detalles de tus pedidos ya generados.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VendedorRoutes() {
  return (
    <Routes>
      <Route path="/" element={<VendedorHome />} />
      <Route path="buscar" element={<BuscarReferencias />} />
      <Route path="crear" element={<CrearPedido />} />
      <Route path="pedidos" element={<MisPedidos />} />
      <Route path="*" element={<Navigate to="/vendedor" />} />
    </Routes>
  );
}
