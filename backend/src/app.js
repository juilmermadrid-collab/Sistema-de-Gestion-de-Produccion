const express = require("express");
const cors = require("cors");

const selladorasRoutes = require("./routes/selladoras.routes");
const planillasRoutes = require("./routes/planillas.routes");
const ordenesRoutes = require("./routes/ordenes.routes");
const registrosRoutes = require("./routes/registros.routes");
const reportesRoutes = require("./routes/reportes.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje: "API PlastiPak funcionando correctamente",
  });
});

app.use("/api/selladoras", selladorasRoutes);
app.use("/api/planillas", planillasRoutes);
app.use("/api/ordenes", ordenesRoutes);
app.use("/api/registros", registrosRoutes);
app.use("/api/reportes", reportesRoutes);

module.exports = app;