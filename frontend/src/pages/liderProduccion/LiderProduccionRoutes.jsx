import { useState } from 'react'
import Referencias from './Referencias'
import OrdenesProduccion from './OrdenesProduccion'
import DocumentacionProduccion from './DocumentacionProduccion'

export default function LiderProduccionRoutes() {
  const [pagina, setPagina] = useState('referencias')

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Segoe UI', sans-serif" }}>
      <nav style={{ background: '#1e293b', padding: '1rem', display: 'flex', gap: '1rem' }}>
        <button onClick={() => setPagina('referencias')}
          style={{ color: '#fff', background: 'none', border: '1px solid #fff', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>
          Referencias
        </button>
        <button onClick={() => setPagina('ordenes')}
          style={{ color: '#fff', background: 'none', border: '1px solid #fff', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>
          Órdenes
        </button>
        <button onClick={() => setPagina('documentacion')}
          style={{ color: '#fff', background: 'none', border: '1px solid #fff', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>
          Documentación
        </button>
      </nav>
      <main style={{ padding: '1.5rem' }}>
        {pagina === 'referencias' && <Referencias />}
        {pagina === 'ordenes' && <OrdenesProduccion />}
        {pagina === 'documentacion' && <DocumentacionProduccion />}
      </main>
    </div>
  )
}