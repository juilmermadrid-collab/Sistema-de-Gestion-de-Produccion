const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =====================================================
// 1. LOGIN DE USUARIO
// =====================================================
exports.login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }

    // Buscar usuario por correo
    const { data: usuarios, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('correo', correo)
      .eq('estado', true)
      .single();

    if (userError || !usuarios) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const passwordValido = await bcrypt.compare(password, usuarios.passwordHash);
    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: usuarios.id, 
        correo: usuarios.correo, 
        rol: usuarios.rol 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      usuario: {
        id: usuarios.id,
        nombre: usuarios.nombre,
        correo: usuarios.correo,
        rol: usuarios.rol
      }
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// 2. REGISTRAR NUEVO USUARIO
// =====================================================
exports.register = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    if (!nombre || !correo || !password || !rol) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Verificar si el correo ya existe
    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('id')
      .eq('correo', correo)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    // Encriptar contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        nombre,
        correo,
        passwordHash,
        rol,
        estado: true
      })
      .select('id, nombre, correo, rol')
      .single();

    if (error) throw error;

    res.status(201).json(data);

  } catch (err) {
    console.error('Error en register:', err);
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// 3. OBTENER PERFIL DEL USUARIO
// =====================================================
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, correo, rol, estado')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(data);

  } catch (err) {
    console.error('Error en getProfile:', err);
    res.status(500).json({ error: err.message });
  }
};