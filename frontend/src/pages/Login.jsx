const Login = () => {
  const handleLogin = () => {
    // Simulación de login como operario
    localStorage.setItem('token', 'test-token-operario');
    localStorage.setItem('user_role', 'operario');
    window.location.href = '/operario/planilla';
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: 'var(--bg)'
    }}>
      <div style={{ 
        padding: '2rem', 
        border: '1px solid var(--border)',
        borderRadius: '8px',
        backgroundColor: 'var(--bg)'
      }}>
        <h1 style={{ color: 'var(--text-h)', marginBottom: '1rem' }}>
          PlastiPak - Login
        </h1>
        <button
          onClick={handleLogin}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Ingresar como Operario
        </button>
      </div>
    </div>
  );
};

export default Login;