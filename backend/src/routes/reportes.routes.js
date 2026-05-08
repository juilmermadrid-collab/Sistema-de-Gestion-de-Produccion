const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportes.controller');

// Rutas
router.get('/produccion', reportesController.produccionPorFecha);
router.get('/productividad', reportesController.productividadPorOperario);
router.get('/eficiencia', reportesController.eficienciaPorSelladora);

// ← OBLIGATORIO:
module.exports = router;