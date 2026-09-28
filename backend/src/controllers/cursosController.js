const Aluno = require("../models/Aluno");
const Curso = require("../models/Curso");
const nextId = require("../utils/nextId");
const { HttpError, parseId, pick } = require("../utils/http");

const CAMPOS = ["nomeDoCurso"];

async function findOr404(rawId) {
  const id = parseId(rawId);
  const curso = await Curso.findOne({ id });
  if (!curso) throw new HttpError(404, `Curso ${id} não encontrado.`);
  return curso;
}

// GET /cursos
exports.list = async (req, res) => {
  res.json(await Curso.find().sort({ id: 1 }));
};

// GET /cursos/:id
exports.getOne = async (req, res) => {
  res.json(await findOr404(req.params.id));
};

// POST /cursos
exports.create = async (req, res) => {
  const curso = new Curso({ ...pick(req.body, CAMPOS), id: 0 });
  await curso.validate();
  curso.id = await nextId("cursos");
  await curso.save();
  res.status(201).location(`/cursos/${curso.id}`).json(curso);
};

// PUT /cursos/:id
exports.replace = async (req, res) => {
  const curso = await findOr404(req.params.id);
  const dados = pick(req.body, CAMPOS);
  for (const campo of CAMPOS) curso.set(campo, dados[campo]);
  await curso.save();
  res.json(curso);
};

// PATCH /cursos/:id
exports.update = async (req, res) => {
  const curso = await findOr404(req.params.id);
  curso.set(pick(req.body, CAMPOS));
  await curso.save();
  res.json(curso);
};

// DELETE /cursos/:id  (recusado se ainda houver alunos nesse curso)
exports.remove = async (req, res) => {
  const curso = await findOr404(req.params.id);
  if (await Aluno.exists({ idCurso: curso.id })) {
    throw new HttpError(409, "Não é possível remover o curso: existem alunos associados.");
  }
  await curso.deleteOne();
  res.status(204).end();
};
