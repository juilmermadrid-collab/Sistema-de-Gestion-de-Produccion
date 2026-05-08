const express = require('express');
const cors = require('cors');
const referenciasRoutes = require('./routes/referencias.routes');
const ordenesRoutes     = require('./routes/ordenes.routes');
const pedidosRoutes     = require('./routes/pedidos.routes');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true, mensaje: 'API corriendo' }));
app.use('/api/referencias', referenciasRoutes);
app.use('/api/ordenes',     ordenesRoutes);
app.use('/api/pedidos',     pedidosRoutes);

app.use((req, res) => res.status(404).json({ ok: false, mensaje: 'Ruta no encontrada' }));
module.exports = app;
