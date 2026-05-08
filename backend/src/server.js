require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅  PlastiPak API escuchando en http://localhost:${PORT}`);
  console.log(`🗄️   Supabase URL: ${process.env.SUPABASE_URL}`);
});
