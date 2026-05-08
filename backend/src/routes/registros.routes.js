const express = require('express');
const router = express.Router();

// Ruta base de prueba
router.get('/', (req, res) => {
  res.json({ 
    mensaje: 'Módulo de Registros',
    endpoints: {
      tareas: '/api/registros/tareas?selladoraId=XXX&turno=turno_1',
      en_curso: '/api/registros/en-curso',
      iniciar: '/api/registros/iniciar (POST)',
      finalizar: '/api/registros/finalizar (POST)'
    }
  });
});

// Controlador (si existe)
try {
  const registrosController = require('../controllers/registros.controller');
  
  router.get('/tareas', registrosController.getTareasPlanilla);
  router.get('/en-curso', registrosController.getRegistrosEnCurso);
  router.post('/iniciar', registrosController.iniciarRegistro);
  router.post('/finalizar', registrosController.finalizarRegistro);
} catch (err) {
  console.log('⚠️  Controlador de registros no disponible');
}

module.exports = router;