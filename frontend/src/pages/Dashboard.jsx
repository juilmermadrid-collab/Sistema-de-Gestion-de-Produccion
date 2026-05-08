const Dashboard = () => {
  return (
    <div style={{ padding: '2rem', color: 'var(--text)' }}>
      <h1 style={{ color: 'var(--text-h)', marginBottom: '1rem' }}>
        Bienvenido a PlastiPak
      </h1>
      <p>Selecciona un módulo para comenzar</p>
      
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <a 
          href="/operario/planilla" 
          style={{
            padding: '1rem 2rem',
            backgroundColor: 'var(--accent)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          Ir a Mi Planilla (Operario)
        </a>
      </div>
    </div>
  );
};

export default Dashboard;