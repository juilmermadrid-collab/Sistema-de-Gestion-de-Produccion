export default function MiPlanilla() {
  return (
    <div style={{ padding: '32px', minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ maxWidth: '920px', margin: '0 auto', background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '28px', boxShadow: '0 18px 40px rgba(15,23,42,0.06)' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', color: '#0f172a' }}>Mi planilla</h1>
        <p style={{ margin: '12px 0 24px', color: '#475569', lineHeight: 1.8 }}>
          Aquí podrás ver tus datos de producción asignados para el turno y el estado de cada registro.
        </p>
        <p style={{ margin: 0, color: '#475569' }}>
          Si deseas, este módulo puede completarse con la lógica para mostrar las planillas y los pasos operativos del turno.
        </p>
      </div>
    </div>
  );
}
