// Carrega mock-data/bd.json para o MongoDB.  Uso: npm run seed
// É idempotente: faz upsert por id, por isso pode ser corrido várias vezes sem duplicar nada
// e não apaga registos que já existam na base de dados.
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "..", ".env"), quiet: true });

const mongoose = require("mongoose");
const { isConfigured } = require("./config/db");
const Aluno = require("./models/Aluno");
const Curso = require("./models/Curso");
const Counter = require("./models/Counter");

const BD_JSON = path.join(__dirname, "..", "..", "mock-data", "bd.json");

async function upsertAll(Model, docs, nome) {
  const semId = docs.filter((d) => !Number.isInteger(d.id));
  if (semId.length) throw new Error(`${semId.length} registo(s) de "${nome}" sem id numérico no bd.json.`);

  if (docs.length === 0) return;
  // replaceOne (e não $set) para os campos ficarem gravados pela ordem do bd.json.
  await Model.bulkWrite(docs.map((doc) => ({ replaceOne: { filter: { id: doc.id }, replacement: doc, upsert: true } })));
  // $max: o contador nunca recua, por isso os próximos POST continuam a gerar ids livres.
  await Counter.updateOne({ _id: nome }, { $max: { seq: Math.max(...docs.map((d) => d.id)) } }, { upsert: true });
  console.log(`[seed] ${nome}: ${docs.length} registo(s) carregado(s).`);
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!isConfigured(uri)) {
    console.error("[seed] MONGODB_URI não está configurada. Copia backend/.env.example para backend/.env e preenche-a.");
    process.exit(1);
  }

  const { alunos = [], cursos = [] } = JSON.parse(fs.readFileSync(BD_JSON, "utf8"));

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log(`[seed] Ligado a "${mongoose.connection.name}".`);

  // Os cursos primeiro, porque os alunos referenciam-nos.
  await upsertAll(Curso, cursos, "cursos");
  await upsertAll(Aluno, alunos, "alunos");
}

main()
  .catch((err) => {
    console.error(`[seed] Erro: ${err.message}`);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
