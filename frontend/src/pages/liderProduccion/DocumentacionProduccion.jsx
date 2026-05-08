import { useState, useEffect, useCallback } from 'react'
import { getDocumentacionProduccion } from '../../api/pedidosApi'
import { getOrdenes } from '../../api/ordenesApi'

const ETIQUETA = { por_programar:'Por programar', pendiente_por_material:'Pend. material', programada:'Programada', en_proceso:'En proceso', finalizada:'Finalizada' }
const CARD_COLOR = { por_programar:{bg:'#fef9c3',text:'#854d0e',border:'#fde68a'}, pendiente_por_material:{bg:'#fee2e2',text:'#b91c1c',border:'#fecaca'}, programada:{bg:'#dbeafe',text:'#1d4ed8',border:'#bfdbfe'}, en_proceso:{bg:'#dcfce7',text:'#15803d',border:'#bbf7d0'}, finalizada:{bg:'#f1f5f9',text:'#475569',border:'#e2e8f0'} }
const BADGE_COLOR = { por_programar:{bg:'#fef9c3',text:'#854d0e'}, pendiente_por_material:{bg:'#fee2e2',text:'#b91c1c'}, programada:{bg:'#dbeafe',text:'#1d4ed8'}, en_proceso:{bg:'#dcfce7',text:'#15803d'}, finalizada:{bg:'#f1f5f9',text:'#475569'} }

export default function DocumentacionProduccion() {
  const [resumen, setResumen]           = useState({})
  const [ordenes, setOrdenes]           = useState([])
  const [cargando, setCargando]         = useState(false)
  const [error, setError]               = useState('')
  const hoy    = new Date().toISOString().slice(0,10)
  const hace30 = new Date(Date.now()-30*24*3600*1000).toISOString().slice(0,10)
  const [desde, setDesde]               = useState(hace30)
  const [hasta, setHasta]               = useState(hoy)
  const [filtroEstado, setFiltroEstado] = useState('')

  const cargar = useCallback(async () => {
    setCargando(true); setError('')
    try {
      const [r1, r2] = await Promise.all([
        getDocumentacionProduccion({ fecha_desde: desde, fecha_hasta: hasta }),
        getOrdenes({ limit: 200, ...(filtroEstado ? { estado_orden: filtroEstado } : {}) }),
      ])
      setResumen(r1.data.data?.resumen_estados_ordenes || {})
      setOrdenes(r2.data.data || [])
    } catch (e) { setError(e.response?.data?.mensaje || 'Error al cargar documentación.') }
    finally { setCargando(false) }
  }, [desde, hasta, filtroEstado])

  useEffect(() => { cargar() }, [cargar])

  const totalOrdenes = Object.values(resumen).reduce((a,b) => a+b, 0)

  return (
    <div>
      <div style={css.secHeader}>
        <div><h2 style={css.secTitulo}>Documentación de producción</h2><p style={css.secSub}>Vista consolidada para supervisión y entrega a gerencia</p></div>
      </div>
      {error && <Alert tipo="error">{error}</Alert>}
      <div style={css.card}>
        <div style={{ display:'flex', gap:'1rem', alignItems:'flex-end', flexWrap:'wrap' }}>
          <div><label style={css.lbl}>Desde</label><input type="date" style={css.input} value={desde} onChange={e => setDesde(e.target.value)}/></div>
          <div><label style={css.lbl}>Hasta</label><input type="date" style={css.input} value={hasta} onChange={e => setHasta(e.target.value)}/></div>
          <div><label style={css.lbl}>Estado</label>
            <select style={css.input} value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              {Object.keys(ETIQUETA).map(e => <option key={e} value={e}>{ETIQUETA[e]}</option>)}
            </select>
          </div>
          <button style={css.btnPrimary} onClick={cargar} disabled={cargando}>{cargando?'Consultando...':'Consultar'}</button>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:'0.75rem', marginBottom:'1rem' }}>
        <div style={{ background:'#1e40af', borderRadius:'12px', padding:'1.1rem 1.25rem', border:'1px solid #1d4ed8' }}>
          <p style={{ margin:'0 0 6px', fontSize:'0.72rem', fontWeight:700, color:'#bfdbfe', textTransform:'uppercase', letterSpacing:'0.8px' }}>Total órdenes</p>
          <p style={{ margin:0, fontSize:'2rem', fontWeight:800, color:'#fff', lineHeight:1 }}>{totalOrdenes}</p>
        </div>
        {Object.entries(ETIQUETA).map(([estado, etiqueta]) => {
          const c = CARD_COLOR[estado]
          return (
            <div key={estado} style={{ background:c.bg, borderRadius:'12px', padding:'1.1rem 1.25rem', border:`1px solid ${c.border}` }}>
              <p style={{ margin:'0 0 6px', fontSize:'0.72rem', fontWeight:700, color:c.text, textTransform:'uppercase', letterSpacing:'0.8px' }}>{etiqueta}</p>
              <p style={{ margin:0, fontSize:'2rem', fontWeight:800, color:c.text, lineHeight:1 }}>{resumen[estado]||0}</p>
            </div>
          )
        })}
      </div>
      <div style={css.card}>
        <h3 style={{ margin:'0 0 1rem', fontSize:'0.95rem', fontWeight:700, color:'#1e293b' }}>Detalle de órdenes</h3>
        {cargando ? <p style={css.loading}>Cargando...</p> : (
          <div style={{ overflowX:'auto' }}>
            <table style={css.tabla}>
              <thead><tr>{['N° Orden','Pedido','Referencia','Cant.','Estado','Proceso','F. entrega','Creada'].map(h => <th key={h} style={css.th}>{h}</th>)}</tr></thead>
              <tbody>
                {ordenes.length === 0 ? <tr><td colSpan={8} style={css.emptyCell}>No hay órdenes para los filtros seleccionados.</td></tr>
                  : ordenes.map(o => {
                    const c = BADGE_COLOR[o.estado_orden] || { bg:'#f1f5f9', text:'#475569' }
                    return (
                      <tr key={o.id} style={css.tr}>
                        <td style={css.td}><span style={css.codeTag}>{o.numero_orden}</span></td>
                        <td style={css.td}><span style={{ fontWeight:500, color:'#1e293b' }}>{o.pedidos?.numero_pedido||'—'}</span><p style={{ margin:'2px 0 0', fontSize:'0.72rem', color:'#94a3b8' }}>{o.pedidos?.fecha_toma}</p></td>
                        <td style={css.td}><span style={{ fontWeight:600, color:'#1e293b' }}>{o.referencia_corta||o.referencia}</span><p style={{ margin:'2px 0 0', fontSize:'0.72rem', color:'#94a3b8' }}>{o.nombre_referencia}</p></td>
                        <td style={{ ...css.td, textAlign:'center', fontWeight:600 }}>{o.cantidad_programada}</td>
                        <td style={css.td}><span style={{ background:c.bg, color:c.text, padding:'3px 10px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:600 }}>{ETIQUETA[o.estado_orden]||o.estado_orden}</span></td>
                        <td style={css.td}><span style={css.pill}>{o.proceso_controlado}</span></td>
                        <td style={{ ...css.td, fontSize:'0.78rem' }}>{o.pedidos?.fecha_entrega_pactada||'—'}</td>
                        <td style={{ ...css.td, fontSize:'0.78rem' }}>{new Date(o.created_at).toLocaleDateString('es-CO')}</td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {ordenes.length > 0 && <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:'10px', padding:'0.9rem 1.1rem', fontSize:'0.83rem', color:'#1d4ed8', lineHeight:1.6 }}><strong>📌 Nota:</strong> Para el reporte operativo detallado por turno consultar al Auxiliar de producción en el módulo de Reportes.</div>}
    </div>
  )
}

function Alert({ tipo, children }) {
  const s = tipo==='error' ? { background:'#fef2f2', border:'1px solid #fecaca', color:'#b91c1c' } : { background:'#f0fdf4', border:'1px solid #bbf7d0', color:'#15803d' }
  return <div style={{ ...s, padding:'0.65rem 1rem', borderRadius:'8px', fontSize:'0.85rem', marginBottom:'1rem' }}>{children}</div>
}

const css = {
  secHeader:{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.25rem' },
  secTitulo:{ margin:'0 0 4px', fontSize:'1.35rem', fontWeight:700, color:'#1e293b' },
  secSub:{ margin:0, fontSize:'0.83rem', color:'#64748b' },
  card:{ background:'#fff', borderRadius:'12px', border:'1px solid #e2e8f0', padding:'1.25rem', marginBottom:'1rem', boxShadow:'0 1px 3px rgba(0,0,0,0.04)' },
  lbl:{ display:'block', fontSize:'0.75rem', fontWeight:600, color:'#475569', marginBottom:'4px' },
  input:{ padding:'0.5rem 0.75rem', border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'0.85rem', color:'#1e293b', background:'#f8fafc', outline:'none' },
  tabla:{ width:'100%', borderCollapse:'collapse', fontSize:'0.85rem' },
  th:{ padding:'0.65rem 0.9rem', textAlign:'left', fontSize:'0.75rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.5px', borderBottom:'2px solid #f1f5f9', background:'#f8fafc' },
  tr:{ borderBottom:'1px solid #f1f5f9' },
  td:{ padding:'0.75rem 0.9rem', verticalAlign:'middle', color:'#475569' },
  emptyCell:{ textAlign:'center', padding:'3rem', color:'#94a3b8', fontSize:'0.88rem' },
  codeTag:{ fontFamily:'monospace', fontSize:'0.8rem', background:'#eff6ff', color:'#1d4ed8', padding:'2px 7px', borderRadius:'5px', fontWeight:600 },
  pill:{ background:'#f1f5f9', color:'#475569', padding:'2px 9px', borderRadius:'20px', fontSize:'0.78rem', fontWeight:500 },
  loading:{ textAlign:'center', padding:'3rem', color:'#94a3b8', fontSize:'0.9rem' },
  btnPrimary:{ background:'#1d4ed8', color:'#fff', border:'none', padding:'0.55rem 1.25rem', borderRadius:'8px', cursor:'pointer', fontSize:'0.85rem', fontWeight:600 },
}
