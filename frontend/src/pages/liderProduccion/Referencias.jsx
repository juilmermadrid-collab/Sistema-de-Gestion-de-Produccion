import { useState, useEffect, useCallback } from 'react'
import { getReferencias, getReferenciaById, crearReferencia, editarReferencia, cambiarEstadoReferencia } from '../../api/referenciasApi'

const FORM_INICIAL = {
  referencia: '', referencia_corta: '', nombre: '', grupo: '', estado: 'activa',
  descripcion: '', codigo_barras: '', presentacion: '', unidad_medida: 'unidades',
  costo: '', impuesto: '', valor_unitario: '', tipo_producto: '', materia_prima: '',
  color: '', troquelado: '', ancho: '', fuelle_izquierdo: '', fuelle_derecho: '',
  alto: '', fuelle_superior: '', fuelle_fondo: '', calibre: '', impresion: false,
  colores: [], tipo_cliente: '', tipo_impresion: '', sellado: '', tratado_cara: '',
  medida: '', requiere_extrusion: false, requiere_impresion: false,
  requiere_refilado: false, requiere_sellado: true, precios: [],
}

export default function Referencias() {
  const [referencias, setReferencias] = useState([])
  const [total, setTotal]             = useState(0)
  const [pagina, setPagina]           = useState(1)
  const [filtros, setFiltros]         = useState({ q: '', tipo_producto: '', materia_prima: '', estado: 'activa' })
  const [modal, setModal]             = useState(false)
  const [edicion, setEdicion]         = useState(false)
  const [idEdit, setIdEdit]           = useState(null)
  const [form, setForm]               = useState(FORM_INICIAL)
  const [cargando, setCargando]       = useState(false)
  const [guardando, setGuardando]     = useState(false)
  const [error, setError]             = useState('')
  const [exito, setExito]             = useState('')
  const LIMIT = 15

  const cargar = useCallback(async () => {
    setCargando(true); setError('')
    try {
      const r = await getReferencias({ ...filtros, page: pagina, limit: LIMIT })
      setReferencias(r.data.data || [])
      setTotal(r.data.total || 0)
    } catch (e) { setError(e.response?.data?.mensaje || 'Error al cargar referencias.') }
    finally { setCargando(false) }
  }, [filtros, pagina])

  useEffect(() => { cargar() }, [cargar])

  const handleFiltro = e => { setFiltros(f => ({ ...f, [e.target.name]: e.target.value })); setPagina(1) }
  const abrirNueva = () => { setForm(FORM_INICIAL); setEdicion(false); setIdEdit(null); setError(''); setExito(''); setModal(true) }

  const abrirEdicion = async id => {
    setError(''); setExito('')
    try {
      const r = await getReferenciaById(id)
      const d = r.data.data
      setForm({ ...FORM_INICIAL, ...d, costo: d.costo ?? '', impuesto: d.impuesto ?? '', valor_unitario: d.valor_unitario ?? '', ancho: d.ancho ?? '', fuelle_izquierdo: d.fuelle_izquierdo ?? '', fuelle_derecho: d.fuelle_derecho ?? '', alto: d.alto ?? '', calibre: d.calibre ?? '', precios: d.referencia_precios || [] })
      setEdicion(true); setIdEdit(id); setModal(true)
    } catch { setError('No se pudo cargar la referencia.') }
  }

  const handleForm = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const addPrecio  = () => setForm(f => ({ ...f, precios: [...f.precios, { categoria: '', precio: '', incluye_impuesto: false }] }))
  const editPrecio = (i, k, v) => setForm(f => { const p = [...f.precios]; p[i] = { ...p[i], [k]: v }; return { ...f, precios: p } })
  const delPrecio  = i => setForm(f => ({ ...f, precios: f.precios.filter((_, j) => j !== i) }))

  const guardar = async e => {
    e.preventDefault(); setGuardando(true); setError(''); setExito('')
    const payload = { ...form, costo: form.costo !== '' ? parseFloat(form.costo) : null, impuesto: form.impuesto !== '' ? parseFloat(form.impuesto) : null, valor_unitario: parseFloat(form.valor_unitario) || 0, ancho: parseFloat(form.ancho), fuelle_izquierdo: form.fuelle_izquierdo !== '' ? parseFloat(form.fuelle_izquierdo) : null, fuelle_derecho: form.fuelle_derecho !== '' ? parseFloat(form.fuelle_derecho) : null, alto: form.alto !== '' ? parseFloat(form.alto) : null, calibre: form.calibre !== '' ? parseFloat(form.calibre) : null, precios: form.precios.map(p => ({ ...p, precio: parseFloat(p.precio) || 0 })) }
    try {
      if (edicion) { await editarReferencia(idEdit, payload); setExito('Referencia actualizada correctamente.') }
      else { await crearReferencia(payload); setExito('Referencia creada correctamente.') }
      setModal(false); cargar()
    } catch (e) { setError(e.response?.data?.mensaje || 'Error al guardar.') }
    finally { setGuardando(false) }
  }

  const toggleEstado = async (id, est) => {
    if (!window.confirm(`¿Cambiar estado a "${est === 'activa' ? 'inactiva' : 'activa'}"?`)) return
    try { await cambiarEstadoReferencia(id, est === 'activa' ? 'inactiva' : 'activa'); cargar() }
    catch (e) { alert(e.response?.data?.mensaje || 'Error.') }
  }

  const totalPags = Math.ceil(total / LIMIT)

  return (
    <div>
      <div style={css.secHeader}>
        <div><h2 style={css.secTitulo}>Referencias</h2><p style={css.secSub}>Gestión de productos del catálogo de producción</p></div>
        <button style={css.btnPrimary} onClick={abrirNueva}>+ Nueva referencia</button>
      </div>
      {error && <Alert tipo="error">{error}</Alert>}
      {exito && <Alert tipo="exito">{exito}</Alert>}
      <div style={css.card}>
        <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
          <input style={css.input} placeholder="🔍  Buscar por código, nombre o descripción..." name="q" value={filtros.q} onChange={handleFiltro} />
          <input style={{ ...css.input, maxWidth:'200px' }} placeholder="Tipo de producto" name="tipo_producto" value={filtros.tipo_producto} onChange={handleFiltro} />
          <input style={{ ...css.input, maxWidth:'200px' }} placeholder="Materia prima" name="materia_prima" value={filtros.materia_prima} onChange={handleFiltro} />
          <select style={{ ...css.input, maxWidth:'150px' }} name="estado" value={filtros.estado} onChange={handleFiltro}>
            <option value="activa">Activas</option><option value="inactiva">Inactivas</option><option value="todas">Todas</option>
          </select>
        </div>
      </div>
      <div style={css.card}>
        {cargando ? <p style={css.loading}>Cargando referencias...</p> : (
          <div style={{ overflowX:'auto' }}>
            <table style={css.tabla}>
              <thead><tr>{['Referencia','Nombre','Tipo','Materia prima','Ancho','Sellado','Estado','Acciones'].map(h => <th key={h} style={css.th}>{h}</th>)}</tr></thead>
              <tbody>
                {referencias.length === 0 ? <tr><td colSpan={8} style={css.emptyCell}>No se encontraron referencias.</td></tr>
                  : referencias.map(ref => (
                    <tr key={ref.id} style={css.tr}>
                      <td style={css.td}><span style={css.codeTag}>{ref.referencia_corta}</span><p style={{ margin:'2px 0 0', fontSize:'0.72rem', color:'#94a3b8' }}>{ref.referencia}</p></td>
                      <td style={{ ...css.td, fontWeight:500, color:'#1e293b' }}>{ref.nombre}</td>
                      <td style={css.td}><span style={css.pill}>{ref.tipo_producto}</span></td>
                      <td style={css.td}>{ref.materia_prima}</td>
                      <td style={{ ...css.td, textAlign:'center', fontWeight:600 }}>{ref.ancho}</td>
                      <td style={css.td}>{ref.sellado}</td>
                      <td style={css.td}><span style={ref.estado==='activa'?css.badgeGreen:css.badgeRed}>{ref.estado==='activa'?'● Activa':'○ Inactiva'}</span></td>
                      <td style={{ ...css.td, whiteSpace:'nowrap' }}>
                        <button style={css.btnSm} onClick={() => abrirEdicion(ref.id)}>Editar</button>
                        <button style={ref.estado==='activa'?css.btnSmDanger:css.btnSmSuccess} onClick={() => toggleEstado(ref.id, ref.estado)}>{ref.estado==='activa'?'Inactivar':'Activar'}</button>
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
      {modal && (
        <div style={css.overlay}>
          <div style={css.drawer}>
            <div style={css.drawerHeader}>
              <h3 style={{ margin:0, fontSize:'1.05rem', fontWeight:700, color:'#1e293b' }}>{edicion?'Editar referencia':'Nueva referencia'}</h3>
              <button style={css.btnClose} onClick={() => setModal(false)}>✕</button>
            </div>
            {error && <div style={{ padding:'0 1.5rem' }}><Alert tipo="error">{error}</Alert></div>}
            <form onSubmit={guardar} style={css.drawerBody}>
              <Grupo titulo="Información general">
                <Grid2><Field label="Referencia *"><input style={css.iF} name="referencia" value={form.referencia} onChange={handleForm} required disabled={edicion}/></Field><Field label="Referencia corta *"><input style={css.iF} name="referencia_corta" value={form.referencia_corta} onChange={handleForm} required/></Field></Grid2>
                <Grid2><Field label="Nombre *"><input style={css.iF} name="nombre" value={form.nombre} onChange={handleForm} required/></Field><Field label="Grupo"><input style={css.iF} name="grupo" value={form.grupo} onChange={handleForm}/></Field></Grid2>
                <Grid3><Field label="Código de barras"><input style={css.iF} name="codigo_barras" value={form.codigo_barras} onChange={handleForm}/></Field><Field label="Presentación"><input style={css.iF} name="presentacion" value={form.presentacion} onChange={handleForm}/></Field><Field label="Unidad de medida"><input style={css.iF} name="unidad_medida" value={form.unidad_medida} onChange={handleForm}/></Field></Grid3>
                <Grid3><Field label="Costo"><input type="number" step="0.01" style={css.iF} name="costo" value={form.costo} onChange={handleForm}/></Field><Field label="Impuesto"><input type="number" step="0.01" style={css.iF} name="impuesto" value={form.impuesto} onChange={handleForm}/></Field><Field label="Valor unitario"><input type="number" step="0.01" style={css.iF} name="valor_unitario" value={form.valor_unitario} onChange={handleForm}/></Field></Grid3>
                <Field label="Descripción"><textarea name="descripcion" value={form.descripcion} onChange={handleForm} rows={2} style={{ ...css.iF, resize:'vertical' }}/></Field>
              </Grupo>
              <Grupo titulo="Tipo de producto y materia prima">
                <Grid2>
                  <Field label="Tipo de producto *"><select style={css.iF} name="tipo_producto" value={form.tipo_producto} onChange={handleForm} required><option value="">-- Seleccionar --</option>{['B-Bolsa','R-Rollo','L-Lámina'].map(o => <option key={o}>{o}</option>)}</select></Field>
                  <Field label="Materia prima *"><input style={css.iF} name="materia_prima" value={form.materia_prima} onChange={handleForm} required/></Field>
                </Grid2>
              </Grupo>
              <Grupo titulo="Parámetros técnicos">
                <Grid2><Field label="Color"><input style={css.iF} name="color" value={form.color} onChange={handleForm}/></Field><Field label="Troquelado"><input style={css.iF} name="troquelado" value={form.troquelado} onChange={handleForm}/></Field></Grid2>
                <Grid3><Field label="Ancho *"><input type="number" step="0.01" style={css.iF} name="ancho" value={form.ancho} onChange={handleForm} required/></Field><Field label="Fuelle izq."><input type="number" step="0.01" style={css.iF} name="fuelle_izquierdo" value={form.fuelle_izquierdo} onChange={handleForm}/></Field><Field label="Fuelle der."><input type="number" step="0.01" style={css.iF} name="fuelle_derecho" value={form.fuelle_derecho} onChange={handleForm}/></Field></Grid3>
                <Grid3><Field label="Alto"><input type="number" step="0.01" style={css.iF} name="alto" value={form.alto} onChange={handleForm}/></Field><Field label="Fuelle sup."><input type="number" step="0.01" style={css.iF} name="fuelle_superior" value={form.fuelle_superior} onChange={handleForm}/></Field><Field label="Fuelle fondo"><input type="number" step="0.01" style={css.iF} name="fuelle_fondo" value={form.fuelle_fondo} onChange={handleForm}/></Field></Grid3>
                <Grid3><Field label="Calibre"><input type="number" step="0.01" style={css.iF} name="calibre" value={form.calibre} onChange={handleForm}/></Field><Field label="Sellado *"><select style={css.iF} name="sellado" value={form.sellado} onChange={handleForm} required><option value="">-- Seleccionar --</option>{['F-Sellado Fondo','L-Sellado Lateral','D-Doble Sellado'].map(o => <option key={o}>{o}</option>)}</select></Field><Field label="Medida *"><input style={css.iF} name="medida" value={form.medida} onChange={handleForm} required/></Field></Grid3>
                <Grid3><Field label="Tipo cliente"><input style={css.iF} name="tipo_cliente" value={form.tipo_cliente} onChange={handleForm}/></Field><Field label="Tipo impresión"><input style={css.iF} name="tipo_impresion" value={form.tipo_impresion} onChange={handleForm}/></Field><Field label="Tratado cara"><input style={css.iF} name="tratado_cara" value={form.tratado_cara} onChange={handleForm}/></Field></Grid3>
                <CheckField name="impresion" checked={form.impresion} onChange={handleForm} label="Tiene impresión"/>
              </Grupo>
              <Grupo titulo="Procesos requeridos">
                <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap' }}>
                  {[['requiere_extrusion','Extrusión'],['requiere_impresion','Impresión'],['requiere_refilado','Refilado'],['requiere_sellado','Sellado']].map(([n,l]) => (
                    <CheckField key={n} name={n} checked={form[n]} onChange={handleForm} label={l}/>
                  ))}
                </div>
              </Grupo>
              <Grupo titulo="Precios por categoría">
                {form.precios.map((p,i) => (
                  <div key={i} style={{ display:'flex', gap:'0.5rem', alignItems:'center', marginBottom:'0.5rem', flexWrap:'wrap' }}>
                    <input placeholder="Categoría" value={p.categoria} onChange={e => editPrecio(i,'categoria',e.target.value)} style={{ ...css.iF, flex:2 }}/>
                    <input type="number" step="0.01" placeholder="Precio" value={p.precio} onChange={e => editPrecio(i,'precio',e.target.value)} style={{ ...css.iF, flex:1 }}/>
                    <label style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'0.8rem', color:'#475569', whiteSpace:'nowrap' }}><input type="checkbox" checked={p.incluye_impuesto} onChange={e => editPrecio(i,'incluye_impuesto',e.target.checked)}/> Con imp.</label>
                    <button type="button" style={css.btnSmDanger} onClick={() => delPrecio(i)}>Quitar</button>
                  </div>
                ))}
                <button type="button" style={css.btnOutline} onClick={addPrecio}>+ Agregar precio</button>
              </Grupo>
              <div style={css.drawerFooter}>
                <button type="button" style={css.btnOutline} onClick={() => setModal(false)} disabled={guardando}>Cancelar</button>
                <button type="submit" style={css.btnPrimary} disabled={guardando}>{guardando?'Guardando...':edicion?'Actualizar':'Crear referencia'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function Grupo({ titulo, children }) {
  return <div style={{ marginBottom:'1.25rem' }}><p style={{ margin:'0 0 0.6rem', fontSize:'0.72rem', fontWeight:700, color:'#1d4ed8', textTransform:'uppercase', letterSpacing:'0.8px' }}>{titulo}</p><div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'10px', padding:'1rem' }}>{children}</div></div>
}
function Grid2({ children }) { return <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'0.75rem' }}>{children}</div> }
function Grid3({ children }) { return <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.75rem', marginBottom:'0.75rem' }}>{children}</div> }
function Field({ label, children }) { return <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}><label style={{ fontSize:'0.75rem', fontWeight:600, color:'#475569' }}>{label}</label>{children}</div> }
function CheckField({ name, checked, onChange, label }) { return <label style={{ display:'flex', alignItems:'center', gap:'7px', fontSize:'0.85rem', color:'#374151', cursor:'pointer' }}><input type="checkbox" name={name} checked={checked} onChange={onChange} style={{ width:'15px', height:'15px', accentColor:'#1d4ed8' }}/>{label}</label> }
function Alert({ tipo, children }) {
  const s = tipo==='error' ? { background:'#fef2f2', border:'1px solid #fecaca', color:'#b91c1c' } : { background:'#f0fdf4', border:'1px solid #bbf7d0', color:'#15803d' }
  return <div style={{ ...s, padding:'0.65rem 1rem', borderRadius:'8px', fontSize:'0.85rem', marginBottom:'1rem' }}>{children}</div>
}

const css = {
  secHeader:{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.25rem' },
  secTitulo:{ margin:'0 0 4px', fontSize:'1.35rem', fontWeight:700, color:'#1e293b' },
  secSub:{ margin:0, fontSize:'0.83rem', color:'#64748b' },
  card:{ background:'#fff', borderRadius:'12px', border:'1px solid #e2e8f0', padding:'1.25rem', marginBottom:'1rem', boxShadow:'0 1px 3px rgba(0,0,0,0.04)' },
  input:{ flex:1, minWidth:'180px', padding:'0.5rem 0.75rem', border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'0.85rem', color:'#1e293b', outline:'none', background:'#f8fafc' },
  iF:{ width:'100%', padding:'0.5rem 0.75rem', border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'0.85rem', color:'#1e293b', outline:'none', background:'#fff', boxSizing:'border-box' },
  tabla:{ width:'100%', borderCollapse:'collapse', fontSize:'0.85rem' },
  th:{ padding:'0.65rem 0.9rem', textAlign:'left', fontSize:'0.75rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.5px', borderBottom:'2px solid #f1f5f9', background:'#f8fafc' },
  tr:{ borderBottom:'1px solid #f1f5f9' },
  td:{ padding:'0.75rem 0.9rem', verticalAlign:'middle', color:'#475569', fontSize:'0.85rem' },
  emptyCell:{ textAlign:'center', padding:'3rem', color:'#94a3b8', fontSize:'0.88rem' },
  loading:{ textAlign:'center', padding:'3rem', color:'#94a3b8', fontSize:'0.9rem' },
  codeTag:{ fontFamily:'monospace', fontSize:'0.8rem', background:'#eff6ff', color:'#1d4ed8', padding:'2px 7px', borderRadius:'5px', fontWeight:600 },
  pill:{ background:'#f1f5f9', color:'#475569', padding:'2px 9px', borderRadius:'20px', fontSize:'0.78rem', fontWeight:500 },
  badgeGreen:{ background:'#dcfce7', color:'#15803d', padding:'3px 10px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:600 },
  badgeRed:{ background:'#fee2e2', color:'#b91c1c', padding:'3px 10px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:600 },
  pagination:{ display:'flex', justifyContent:'center', alignItems:'center', gap:'1rem', marginTop:'1rem', paddingTop:'1rem', borderTop:'1px solid #f1f5f9' },
  btnPrimary:{ background:'#1d4ed8', color:'#fff', border:'none', padding:'0.55rem 1.25rem', borderRadius:'8px', cursor:'pointer', fontSize:'0.85rem', fontWeight:600 },
  btnOutline:{ background:'#fff', color:'#374151', border:'1px solid #d1d5db', padding:'0.5rem 1.1rem', borderRadius:'8px', cursor:'pointer', fontSize:'0.85rem', fontWeight:500 },
  btnSm:{ background:'#eff6ff', color:'#1d4ed8', border:'1px solid #bfdbfe', padding:'0.3rem 0.75rem', borderRadius:'6px', cursor:'pointer', fontSize:'0.78rem', fontWeight:500, marginRight:'4px' },
  btnSmDanger:{ background:'#fef2f2', color:'#b91c1c', border:'1px solid #fecaca', padding:'0.3rem 0.75rem', borderRadius:'6px', cursor:'pointer', fontSize:'0.78rem', fontWeight:500, marginLeft:'4px' },
  btnSmSuccess:{ background:'#f0fdf4', color:'#15803d', border:'1px solid #bbf7d0', padding:'0.3rem 0.75rem', borderRadius:'6px', cursor:'pointer', fontSize:'0.78rem', fontWeight:500, marginLeft:'4px' },
  btnPage:{ background:'#f8fafc', color:'#374151', border:'1px solid #e2e8f0', padding:'0.4rem 0.9rem', borderRadius:'7px', cursor:'pointer', fontSize:'0.82rem' },
  overlay:{ position:'fixed', inset:0, background:'rgba(15,23,42,0.5)', display:'flex', justifyContent:'flex-end', zIndex:1000 },
  drawer:{ background:'#fff', width:'100%', maxWidth:'680px', height:'100vh', display:'flex', flexDirection:'column', boxShadow:'-8px 0 32px rgba(0,0,0,0.12)' },
  drawerHeader:{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1.25rem 1.5rem', borderBottom:'1px solid #e2e8f0' },
  drawerBody:{ flex:1, overflowY:'auto', padding:'1.25rem 1.5rem' },
  drawerFooter:{ padding:'1rem 1.5rem', borderTop:'1px solid #e2e8f0', display:'flex', justifyContent:'flex-end', gap:'0.75rem', background:'#f8fafc' },
  btnClose:{ background:'none', border:'none', fontSize:'1.1rem', cursor:'pointer', color:'#94a3b8', padding:'0.25rem' },
}
