// server.js
// Ponto de entrada da aplicação. Lê .env, inicia o Express na porta 3000.

import 'dotenv/config';
import app from './src/app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na ${PORT} 🚀`);
});
