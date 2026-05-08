const express = require("express");
const cors = require("cors");

// Importar TODAS las rutas
const referenciasRoutes = require("./routes/referencias.routes");
const selladorasRoutes = require("./routes/selladoras.routes");
const pedidosRoutes = require("./routes/pedidos.routes");
const ordenesRoutes = require("./routes/ordenes.routes");
const planillasRoutes = require("./routes/planillas.routes");
const registrosRoutes = require("./routes/registros.routes");
const reportesRoutes = require("./routes/reportes.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "API PlastiPak funcionando correctamente" });
});

// Registrar TODAS las rutas
app.use("/api/auth", authRoutes);
app.use("/api/referencias", referenciasRoutes);
app.use("/api/selladoras", selladorasRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/ordenes", ordenesRoutes);
app.use("/api/planillas", planillasRoutes);
app.use("/api/registros", registrosRoutes);
app.use("/api/reportes", reportesRoutes);

module.exports = app;