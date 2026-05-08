import { useState, useEffect, useCallback } from 'react'
import { getOrdenes, crearOrden, cambiarEstadoOrden, cambiarEstadoProduccionItem } from '../../api/ordenesApi'
import { getPedidos, getPedidoById } from '../../api/pedidosApi'

const ESTADOS_ORDEN = ['por_programar','pendiente_por_material','programada','en_proceso','finalizada']
const ESTADOS_ITEM  = ['pendiente_por_material','en_produccion','finalizada']
const ETIQUETA = { por_programar:'Por programar', pendiente_por_material:'Pend. material', programada:'Programada', en_proceso:'En proceso', finalizada:'Finalizada', en_produccion:'En producción' }
const BADGE_COLOR = { por_programar:{bg:'#fef9c3',text:'#854d0e'}, pendiente_por_material:{bg:'#fee2e2',text:'#b91c1c'}, programada:{bg:'#dbeafe',text:'#1d4ed8'}, en_proceso:{bg:'#dcfce7',text:'#15803d'}, finalizada:{bg:'#f1f5f9',text:'#475569'}, en_produccion:{bg:'#dcfce7',text:'#15803d'} }

export default function OrdenesProduccion() {
  const [ordenes, setOrdenes]               = useState([])
  const [total, setTotal]                   = useState(0)
  const [pagina, setPagina]                 = useState(1)
  const [filtroEstado, setFiltroEstado]     = useState('')
  const [modalCrear, setModalCrear]         = useState(false)
  const [pedidos, setPedidos]               = useState([])
  const [pedidoSel, setPedidoSel]           = useState('')
  const [detalle, setDetalle]               = useState(null)
  const [itemSel, setItemSel]               = useState('')
  const [cantidad, setCantidad]             = useState('')
  const [modalEstado, setModalEstado]       = useState(false)
  const [ordenActual, setOrdenActual]       = useState(null)
  const [nvoEstadoOrden, setNvoEstadoOrden] = useState('')
  const [modalItem, setModalItem]           = useState(false)
  const [itemActual, setItemActual]         = useState(null)
  const [nvoEstadoItem, setNvoEstadoItem]   = useState('')
  const [cargando, setCargando]             = useState(false)
  const [guardando, setGuardando]           = useState(false)
  const [error, setError]                   = useState('')
  const [exito, setExito]                   = useState('')
  const LIMIT = 15

  const cargar = useCallback(async () => {
    setCargando(true); setError('')
    try {
      const p = { page: pagina, limit: LIMIT }
      if (filtroEstado) p.estado_orden = filtroEstado
      const r = await getOrdenes(p)
      setOrdenes(r.data.data || []); setTotal(r.data.total || 0)
    } catch (e) { setError(e.response?.data?.mensaje || 'Error al cargar órdenes.') }
    finally { setCargando(false) }
  }, [pagina, filtroEstado])

  useEffect(() => { cargar() }, [cargar])

  const abrirCrear = async () => {
    setError(''); setExito(''); setPedidoSel(''); setDetalle(null); setItemSel(''); setCantidad('')
    try { const r = await getPedidos({ estado_pedido: 'en_produccion', limit: 100 }); setPedidos(r.data.data || []) }
    catch { setPedidos([]) }
    setModalCrear(true)
  }

  const handlePedido = async id => {
    setPedidoSel(id); setItemSel(''); setDetalle(null)
    if (!id) return
    try { const r = await getPedidoById(id); setDetalle(r.data.data) }
    catch { setDetalle(null) }
  }

  const crear = async e => {
    e.preventDefault()
    if (!pedidoSel || !itemSel || !cantidad) { setError('Todos los campos son obligatorios.'); return }
    setGuardando(true); setError('')
    try {
      await crearOrden({ pedido_id: pedidoSel, pedido_item_id: itemSel, cantidad_programada: parseFloat(cantidad), proceso_controlado: 'sellado' })
      setExito('Orden creada exitosamente.'); setModalCrear(false); cargar()
    } catch (e) { setError(e.response?.data?.mensaje || 'Error al crear orden.') }
    finally { setGuardando(false) }
  }

  const abrirEstado = o => { setOrdenActual(o); setNvoEstadoOrden(o.estado_orden); setError(''); setModalEstado(true) }
  const guardarEstado = async () => {
    setGuardando(true)
    try { await cambiarEstadoOrden(ordenActual.id, nvoEstadoOrden); setExito('Estado actualizado.'); setModalEstado(false); cargar() }
    catch (e) { setError(e.response?.data?.mensaje || 'Error.') }
    finally { setGuardando(false) }
  }

  const abrirItem = o => { setItemActual(o); setNvoEstadoItem(o.pedido_items?.estado_produccion || 'en_produccion'); setError(''); setModalItem(true) }
  const guardarItem = async () => {
    setGuardando(true)
    try { await cambiarEstadoProduccionItem(itemActual.pedido_item_id, nvoEstadoItem); setExito('Estado actualizado.'); setModalItem(false); cargar() }
    catch (e) { setError(e.response?.data?.mensaje || 'Error.') }
    finally { setGuardando(false) }
  }

  const totalPags = Math.ceil(total / LIMIT)

  return (
    <div>
      <div style={css.secHeader}>
        <div><h2 style={css.secTitulo}>Órdenes de producción</h2><p style={css.secSub}>Creación y seguimiento de órdenes asociadas a pedidos</p></div>
        <button style={css.btnPrimary} onClick={abrirCrear}>+ Nueva orden</button>
      </div>
      {error && <Alert tipo="error">{error}</Alert>}
      {exito && <Alert tipo="exito">{exito}</Alert>}
      <div style={css.card}>
        <div style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
          <label style={{ fontSize:'0.83rem', fontWeight:600, color:'#475569' }}>Filtrar por estado:</label>
          <select style={{ ...css.input, maxWidth:'220px' }} value={filtroEstado} onChange={e => { setFiltroEstado(e.target.value); setPagina(1) }}>
            <option value="">Todos los estados</option>
            {ESTADOS_ORDEN.map(e => <option key={e} value={e}>{ETIQUETA[e]}</option>)}
          </select>
        </div>
      </div>
      <div style={css.card}>
        {cargando ? <p style={css.loading}>Cargando órdenes...</p> : (
          <div style={{ overflowX:'auto' }}>
            <table style={css.tabla}>
              <thead><tr>{['N° Orden','Pedido','Referencia','Cant.','Estado orden','Estado ref.','Fecha','Acciones'].map(h => <th key={h} style={css.th}>{h}</th>)}</tr></thead>
              <tbody>
                {ordenes.length === 0 ? <tr><td colSpan={8} style={css.emptyCell}>No hay órdenes registradas.</td></tr>
                  : ordenes.map(o => (
                    <tr key={o.id} style={css.tr}>
                      <td style={css.td}><span style={css.codeTag}>{o.numero_orden}</span></td>
                      <td style={css.td}>{o.pedidos?.numero_pedido||'—'}</td>
                      <td style={css.td}><span style={{ fontWeight:600, color:'#1e293b' }}>{o.referencia_corta||o.referencia}</span><p style={{ margin:'2px 0 0', fontSize:'0.72rem', color:'#94a3b8' }}>{o.nombre_referencia}</p></td>
                      <td style={{ ...css.td, textAlign:'center', fontWeight:600 }}>{o.cantidad_programada}</td>
                      <td style={css.td}><Badge estado={o.estado_orden}/></td>
                      <td style={css.td}>{o.pedido_items?<Badge estado={o.pedido_items.estado_produccion}/>:<span style={{ color:'#94a3b8' }}>—</span>}</td>
                      <td style={{ ...css.td, fontSize:'0.78rem' }}>{new Date(o.created_at).toLocaleDateString('es-CO')}</td>
                      <td style={{ ...css.td, minWidth:'160px' }}>
                        <button style={{ ...css.btnSm, display:'block', width:'100%', marginBottom:'4px' }} onClick={() => abrirEstado(o)}>Estado orden</button>
                        <button style={{ ...css.btnSm, display:'block', width:'100%' }} onClick={() => abrirItem(o)}>Estado ref.</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={css.pagination}>
          <button style={css.btnPage} disabled={pagina===1} onClick={() => setPagina(p=>p-1)}>← Anterior</button>
          <span style={{ fontSize:'0.82rem', color:'#64748b' }}>Página {pagina} de {totalPags||1} — {total} registros</span>
          <button style={css.btnPage} disabled={pagina>=totalPags} onClick={() => setPagina(p=>p+1)}>Siguiente →</button>
        </div>
      </div>
      {modalCrear && (
        <Drawer titulo="Nueva orden de producción" onClose={() => setModalCrear(false)}>
          <form onSubmit={crear}>
            {error && <Alert tipo="error">{error}</Alert>}
            <Field label="Pedido en producción *"><select style={css.iF} value={pedidoSel} onChange={e => handlePedido(e.target.value)} required><option value="">-- Seleccionar pedido --</option>{pedidos.map(p => <option key={p.id} value={p.id}>{p.numero_pedido} — Entrega: {p.fecha_entrega_pactada}</option>)}</select></Field>
            {detalle && <Field label="Referencia del pedido *"><select style={css.iF} value={itemSel} onChange={e => setItemSel(e.target.value)} required><option value="">-- Seleccionar referencia --</option>{detalle.pedido_items?.map(i => <option key={i.id} value={i.id}>{i.referencia} — {i.nombre_referencia} (cant: {i.cantidad_solicitada})</option>)}</select></Field>}
            <Field label="Cantidad programada *"><input type="number" step="0.01" style={css.iF} value={cantidad} onChange={e => setCantidad(e.target.value)} required/></Field>
            <div style={css.drawerFooter}>
              <button type="button" style={css.btnOutline} onClick={() => setModalCrear(false)} disabled={guardando}>Cancelar</button>
              <button type="submit" style={css.btnPrimary} disabled={guardando}>{guardando?'Creando...':'Crear orden'}</button>
            </div>
          </form>
        </Drawer>
      )}
      {modalEstado && ordenActual && (
        <Drawer titulo="Cambiar estado de orden" onClose={() => setModalEstado(false)} small>
          {error && <Alert tipo="error">{error}</Alert>}
          <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'8px', padding:'0.75rem 1rem', marginBottom:'1rem', fontSize:'0.85rem', color:'#475569' }}>
            Orden: <strong style={{ color:'#1e293b' }}>{ordenActual.numero_orden}</strong>
          </div>
          <Field label="Nuevo estado"><select style={css.iF} value={nvoEstadoOrden} onChange={e => setNvoEstadoOrden(e.target.value)}>{ESTADOS_ORDEN.map(e => <option key={e} value={e}>{ETIQUETA[e]}</option>)}</select></Field>
          <div style={css.drawerFooter}>
            <button style={css.btnOutline} onClick={() => setModalEstado(false)} disabled={guardando}>Cancelar</button>
            <button style={css.btnPrimary} onClick={guardarEstado} disabled={guardando}>{guardando?'Guardando...':'Guardar'}</button>
          </div>
        </Drawer>
      )}
      {modalItem && itemActual && (
        <Drawer titulo="Estado producción por referencia" onClose={() => setModalItem(false)} small>
          {error && <Alert tipo="error">{error}</Alert>}
          <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'8px', padding:'0.75rem 1rem', marginBottom:'1rem', fontSize:'0.85rem', color:'#475569' }}>
            Referencia: <strong style={{ color:'#1e293b' }}>{itemActual.referencia}</strong>
          </div>
          <Field label="Estado de producción"><select style={css.iF} value={nvoEstadoItem} onChange={e => setNvoEstadoItem(e.target.value)}>{ESTADOS_ITEM.map(e => <option key={e} value={e}>{ETIQUETA[e]}</option>)}</select></Field>
          <div style={css.drawerFooter}>
            <button style={css.btnOutline} onClick={() => setModalItem(false)} disabled={guardando}>Cancelar</button>
            <button style={css.btnPrimary} onClick={guardarItem} disabled={guardando}>{guardando?'Guardando...':'Guardar'}</button>
          </div>
        </Drawer>
      )}
    </div>
  )
}

function Badge({ estado }) {
  const c = BADGE_COLOR[estado] || { bg:'#f1f5f9', text:'#475569' }
  return <span style={{ background:c.bg, color:c.text, padding:'3px 10px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:600 }}>{ETIQUETA[estado]||estado}</span>
}
function Drawer({ titulo, onClose, children, small }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.5)', display:'flex', justifyContent:'flex-end', zIndex:1000 }}>
      <div style={{ background:'#fff', width:'100%', maxWidth:small?'420px':'560px', height:'100vh', display:'flex', flexDirection:'column', boxShadow:'-8px 0 32px rgba(0,0,0,0.12)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1.25rem 1.5rem', borderBottom:'1px solid #e2e8f0' }}>
          <h3 style={{ margin:0, fontSize:'1.05rem', fontWeight:700, color:'#1e293b' }}>{titulo}</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:'1.1rem', cursor:'pointer', color:'#94a3b8' }}>✕</button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'1.25rem 1.5rem' }}>{children}</div>
      </div>
    </div>
  )
}
function Field({ label, children }) { return <div style={{ marginBottom:'1rem' }}><label style={{ display:'block', fontSize:'0.75rem', fontWeight:600, color:'#475569', marginBottom:'4px' }}>{label}</label>{children}</div> }
function Alert({ tipo, children }) {
  const s = tipo==='error' ? { background:'#fef2f2', border:'1px solid #fecaca', color:'#b91c1c' } : { background:'#f0fdf4', border:'1px solid #bbf7d0', color:'#15803d' }
  return <div style={{ ...s, padding:'0.65rem 1rem', borderRadius:'8px', fontSize:'0.85rem', marginBottom:'1rem' }}>{children}</div>
}

const css = {
  secHeader:{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.25rem' },
  secTitulo:{ margin:'0 0 4px', fontSize:'1.35rem', fontWeight:700, color:'#1e293b' },
  secSub:{ margin:0, fontSize:'0.83rem', color:'#64748b' },
  card:{ background:'#fff', borderRadius:'12px', border:'1px solid #e2e8f0', padding:'1.25rem', marginBottom:'1rem', boxShadow:'0 1px 3px rgba(0,0,0,0.04)' },
  input:{ padding:'0.5rem 0.75rem', border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'0.85rem', color:'#1e293b', background:'#f8fafc', outline:'none' },
  iF:{ width:'100%', padding:'0.5rem 0.75rem', border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'0.85rem', color:'#1e293b', outline:'none', background:'#fff', boxSizing:'border-box' },
  tabla:{ width:'100%', borderCollapse:'collapse', fontSize:'0.85rem' },
  th:{ padding:'0.65rem 0.9rem', textAlign:'left', fontSize:'0.75rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.5px', borderBottom:'2px solid #f1f5f9', background:'#f8fafc' },
  tr:{ borderBottom:'1px solid #f1f5f9' },
  td:{ padding:'0.75rem 0.9rem', verticalAlign:'middle', color:'#475569' },
  emptyCell:{ textAlign:'center', padding:'3rem', color:'#94a3b8', fontSize:'0.88rem' },
  codeTag:{ fontFamily:'monospace', fontSize:'0.8rem', background:'#eff6ff', color:'#1d4ed8', padding:'2px 7px', borderRadius:'5px', fontWeight:600 },
  loading:{ textAlign:'center', padding:'3rem', color:'#94a3b8', fontSize:'0.9rem' },
  pagination:{ display:'flex', justifyContent:'center', alignItems:'center', gap:'1rem', marginTop:'1rem', paddingTop:'1rem', borderTop:'1px solid #f1f5f9' },
  btnPrimary:{ background:'#1d4ed8', color:'#fff', border:'none', padding:'0.55rem 1.25rem', borderRadius:'8px', cursor:'pointer', fontSize:'0.85rem', fontWeight:600 },
  btnOutline:{ background:'#fff', color:'#374151', border:'1px solid #d1d5db', padding:'0.5rem 1.1rem', borderRadius:'8px', cursor:'pointer', fontSize:'0.85rem', fontWeight:500 },
  btnSm:{ background:'#eff6ff', color:'#1d4ed8', border:'1px solid #bfdbfe', padding:'0.3rem 0.75rem', borderRadius:'6px', cursor:'pointer', fontSize:'0.78rem', fontWeight:500 },
  btnPage:{ background:'#f8fafc', color:'#374151', border:'1px solid #e2e8f0', padding:'0.4rem 0.9rem', borderRadius:'7px', cursor:'pointer', fontSize:'0.82rem' },
  drawerFooter:{ marginTop:'1.5rem', display:'flex', justifyContent:'flex-end', gap:'0.75rem', paddingTop:'1rem', borderTop:'1px solid #f1f5f9' },
}
