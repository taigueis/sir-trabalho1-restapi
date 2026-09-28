const Aluno = require("../models/Aluno");
const Curso = require("../models/Curso");
const nextId = require("../utils/nextId");
const { HttpError, parseId, pick } = require("../utils/http");

const CAMPOS = ["nome", "apelido", "idCurso", "anoCurricular", "idade"];

async function findOr404(rawId) {
  const id = parseId(rawId);
  const aluno = await Aluno.findOne({ id });
  if (!aluno) throw new HttpError(404, `Aluno ${id} não encontrado.`);
  return aluno;
}

async function assertCursoExiste(idCurso) {
  if (!(await Curso.exists({ id: idCurso }))) {
    throw new HttpError(400, `O curso com id ${idCurso} não existe.`);
  }
}

// GET /alunos  (filtro opcional: ?idCurso=)
exports.list = async (req, res) => {
  const filtro = {};
  if (req.query.idCurso !== undefined) filtro.idCurso = parseId(req.query.idCurso, "idCurso");
  res.json(await Aluno.find(filtro).sort({ id: 1 }));
};

// GET /alunos/:id
exports.getOne = async (req, res) => {
  res.json(await findOr404(req.params.id));
};

// POST /alunos
exports.create = async (req, res) => {
  const aluno = new Aluno({ ...pick(req.body, CAMPOS), id: 0 });
  await aluno.validate();
  await assertCursoExiste(aluno.idCurso);
  aluno.id = await nextId("alunos"); // só gasta um id depois de o aluno ser válido
  await aluno.save();
  res.status(201).location(`/alunos/${aluno.id}`).json(aluno);
};

// PUT /alunos/:id  (substitui todos os campos; os omitidos ficam por definir)
exports.replace = async (req, res) => {
  const aluno = await findOr404(req.params.id);
  const dados = pick(req.body, CAMPOS);
  for (const campo of CAMPOS) aluno.set(campo, dados[campo]);
  await aluno.validate();
  await assertCursoExiste(aluno.idCurso);
  await aluno.save();
  res.json(aluno);
};

// PATCH /alunos/:id  (atualiza só os campos enviados)
exports.update = async (req, res) => {
  const aluno = await findOr404(req.params.id);
  aluno.set(pick(req.body, CAMPOS));
  await aluno.validate();
  await assertCursoExiste(aluno.idCurso);
  await aluno.save();
  res.json(aluno);
};

// DELETE /alunos/:id
exports.remove = async (req, res) => {
  const aluno = await findOr404(req.params.id);
  await aluno.deleteOne();
  res.status(204).end();
};
