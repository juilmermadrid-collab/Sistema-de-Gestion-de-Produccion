const express = require('express');
const router = express.Router();
const referenciasController = require('../controllers/referencias.controller');

router.get('/', referenciasController.getAll);
router.get('/:id', referenciasController.getById);
router.post('/', referenciasController.create);
router.put('/:id', referenciasController.update);
router.delete('/:id', referenciasController.delete);

module.exports = router;