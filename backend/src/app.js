const express = require("express");
const cors = require("cors");

const referenciasRoutes = require("./routes/referencias.routes");
const pedidosRoutes = require("./routes/pedidos.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "API PlastiPak funcionando correctamente" });
});

app.use("/api/referencias", referenciasRoutes);
app.use("/api/pedidos", pedidosRoutes);

module.exports = app;