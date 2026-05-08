const express = require('express');
const router = express.Router();
const planillasController = require('../controllers/planillas.controller');

router.get('/', planillasController.getByFechaTurno);
router.get('/activa', planillasController.getPlanillaActiva);
router.post('/', planillasController.create);
router.put('/:id/cerrar', planillasController.cerrarPlanilla);

module.exports = router;