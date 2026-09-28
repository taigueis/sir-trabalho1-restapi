const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("../docs/swagger");
const requireDb = require("./middleware/requireDb");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const alunosRoutes = require("./routes/alunos");
const cursosRoutes = require("./routes/cursos");
const { isConnected } = require("./config/db");

const app = express();

const origens = (process.env.CORS_ORIGIN || "*").split(",").map((o) => o.trim());
app.use(cors({ origin: origens.includes("*") ? "*" : origens }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ nome: "API de Alunos e Cursos", documentacao: "/api-docs", alunos: "/alunos", cursos: "/cursos" });
});
app.get("/health", (req, res) => {
  res.status(isConnected() ? 200 : 503).json({ api: "ok", baseDeDados: isConnected() ? "ligada" : "indisponível" });
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/alunos", requireDb, alunosRoutes);
app.use("/cursos", requireDb, cursosRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
