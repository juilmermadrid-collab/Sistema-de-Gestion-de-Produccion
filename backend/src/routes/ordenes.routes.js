const express = require('express');
const router = express.Router();

// Controlador (si existe)
try {
  const ordenesController = require('../controllers/ordenes.controller');
  
  router.get('/', ordenesController.getAll);
  router.get('/pedido/:pedidoId', ordenesController.getByPedido);
  router.post('/', ordenesController.create);
  router.put('/:id/estado', ordenesController.updateEstado);
} catch (err) {
  // Si el controlador no existe, usa rutas temporales
  console.log('⚠️  Controlador de ordenes no disponible, usando rutas temporales');
  
  router.get('/', (req, res) => {
    res.json({ mensaje: 'Ruta de ordenes temporal - Controlador no disponible' });
  });
  router.get('/pedido/:pedidoId', (req, res) => {
    res.json({ mensaje: 'Ruta temporal' });
  });
  router.post('/', (req, res) => {
    res.status(201).json({ mensaje: 'Creado (temporal)' });
  });
  router.put('/:id/estado', (req, res) => {
    res.json({ mensaje: 'Actualizado (temporal)' });
  });
}

module.exports = router;