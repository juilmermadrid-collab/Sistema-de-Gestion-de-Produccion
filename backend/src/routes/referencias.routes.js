const { Router } = require('express');
const { listarReferencias, obtenerReferencia, crearReferencia, editarReferencia, cambiarEstadoReferencia } = require('../controllers/referencias.controller');
const router = Router();
router.get('/', listarReferencias);
router.get('/:id', obtenerReferencia);
router.post('/', crearReferencia);
router.put('/:id', editarReferencia);
router.patch('/:id/estado', cambiarEstadoReferencia);
module.exports = router;
