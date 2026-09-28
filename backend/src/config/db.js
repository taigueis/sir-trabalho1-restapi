const dns = require("dns");
const mongoose = require("mongoose");

const RETRY_MS = 15000;

// Opcional: em algumas redes o DNS local recusa consultas SRV (erro "querySrv ECONNREFUSED"),
// que o Node precisa para resolver mongodb+srv://. Ex.: DNS_SERVERS=8.8.8.8,1.1.1.1
if (process.env.DNS_SERVERS) {
  dns.setServers(process.env.DNS_SERVERS.split(",").map((s) => s.trim()));
}

// Um URI em falta ou ainda com os marcadores do .env.example conta como não configurado.
const isConfigured = (uri) => Boolean(uri) && !/<user>|<password>/.test(uri);

const isConnected = () => mongoose.connection.readyState === 1;

// Nunca lança: a API arranca sempre, e os pedidos à BD respondem 503 até haver ligação.
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!isConfigured(uri)) {
    console.warn(
      "[db] AVISO: MONGODB_URI não está configurada (ver backend/.env.example). " +
        "A API está a correr sem base de dados: /alunos e /cursos respondem 503."
    );
    return false;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log("[db] Ligado ao MongoDB.");
    return true;
  } catch (err) {
    console.error(`[db] Falha na ligação ao MongoDB: ${err.message}`);
    console.error(`[db] Nova tentativa em ${RETRY_MS / 1000}s.`);
    setTimeout(connectDB, RETRY_MS);
    return false;
  }
}

module.exports = { connectDB, isConnected, isConfigured };
