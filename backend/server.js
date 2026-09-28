require("dotenv").config({ quiet: true });

const app = require("./src/app");
const { connectDB } = require("./src/config/db");

const PORT = process.env.PORT || 3001;

// O servidor sobe primeiro, mesmo sem base de dados configurada; a ligação ao Mongo é tentada em seguida.
app.listen(PORT, () => {
  console.log(`API a correr em http://localhost:${PORT}`);
  console.log(`Documentação Swagger em http://localhost:${PORT}/api-docs`);
});

connectDB();
