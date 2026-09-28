// Especificação OpenAPI 3.0 servida em /api-docs (swagger-ui-express).

const ref = (name) => ({ $ref: `#/components/schemas/${name}` });
const json = (schema) => ({ "application/json": { schema } });
const erro = (description) => ({ description, content: json(ref("Erro")) });

const idParam = (nome) => ({
  name: "id",
  in: "path",
  required: true,
  description: `Id numérico do ${nome}`,
  schema: { type: "integer", minimum: 1, example: 1 },
});

const respostas = {
  400: erro("Dados inválidos ou id mal formado"),
  404: erro("Registo não encontrado"),
  503: erro("Base de dados indisponível"),
};

// Constrói as 5 operações CRUD de um recurso, já que alunos e cursos têm a mesma forma.
function crud({ tag, singular, plural, schema, input, exemplo, extraListParams = [], deleteExtra = {} }) {
  const body = (required) => ({ required, content: json(ref(input)) });
  const exemploBody = { "application/json": { schema: ref(input), example: exemplo } };
  const withExample = (required) => ({ required, content: exemploBody });

  return {
    [`/${plural}`]: {
      get: {
        tags: [tag],
        summary: `Listar ${plural}`,
        parameters: extraListParams,
        responses: {
          200: { description: `Lista de ${plural}`, content: json({ type: "array", items: ref(schema) }) },
          400: respostas[400],
          503: respostas[503],
        },
      },
      post: {
        tags: [tag],
        summary: `Adicionar ${singular}`,
        requestBody: withExample(true),
        responses: {
          201: { description: `${singular} criado`, content: json(ref(schema)) },
          400: respostas[400],
          503: respostas[503],
        },
      },
    },
    [`/${plural}/{id}`]: {
      get: {
        tags: [tag],
        summary: `Obter ${singular}`,
        parameters: [idParam(singular)],
        responses: { 200: { description: singular, content: json(ref(schema)) }, 400: respostas[400], 404: respostas[404], 503: respostas[503] },
      },
      put: {
        tags: [tag],
        summary: `Substituir ${singular} (todos os campos obrigatórios)`,
        parameters: [idParam(singular)],
        requestBody: withExample(true),
        responses: { 200: { description: `${singular} atualizado`, content: json(ref(schema)) }, 400: respostas[400], 404: respostas[404], 503: respostas[503] },
      },
      patch: {
        tags: [tag],
        summary: `Atualizar parcialmente ${singular}`,
        parameters: [idParam(singular)],
        requestBody: body(true),
        responses: { 200: { description: `${singular} atualizado`, content: json(ref(schema)) }, 400: respostas[400], 404: respostas[404], 503: respostas[503] },
      },
      delete: {
        tags: [tag],
        summary: `Remover ${singular}`,
        parameters: [idParam(singular)],
        responses: { 204: { description: `${singular} removido` }, 400: respostas[400], 404: respostas[404], ...deleteExtra, 503: respostas[503] },
      },
    },
  };
}

module.exports = {
  openapi: "3.0.3",
  info: {
    title: "API de Alunos e Cursos",
    version: "1.0.0",
    description:
      "API RESTful da Atividade Prática #1 (Sistemas de Informação em Rede). Node.js + Express + MongoDB Atlas. " +
      "Os ids são inteiros sequenciais, compatíveis com o json-server usado no mock-server.",
  },
  servers: [{ url: "/", description: "Servidor atual" }],
  tags: [
    { name: "Alunos", description: "Gestão de alunos" },
    { name: "Cursos", description: "Gestão de cursos" },
  ],
  paths: {
    ...crud({
      tag: "Alunos",
      singular: "aluno",
      plural: "alunos",
      schema: "Aluno",
      input: "AlunoInput",
      exemplo: { nome: "Carlos", apelido: "Mendes", idCurso: 3, anoCurricular: 2, idade: 20 },
      extraListParams: [
        {
          name: "idCurso",
          in: "query",
          required: false,
          description: "Devolve apenas os alunos deste curso",
          schema: { type: "integer", minimum: 1, example: 1 },
        },
      ],
    }),
    ...crud({
      tag: "Cursos",
      singular: "curso",
      plural: "cursos",
      schema: "Curso",
      input: "CursoInput",
      exemplo: { nomeDoCurso: "Engenharia de Software" },
      deleteExtra: { 409: erro("O curso ainda tem alunos associados") },
    }),
  },
  components: {
    schemas: {
      Aluno: {
        type: "object",
        properties: {
          id: { type: "integer", example: 4 },
          nome: { type: "string", example: "Tiago" },
          apelido: { type: "string", example: "Rodrigues" },
          idCurso: { type: "integer", example: 3 },
          anoCurricular: { type: "integer", minimum: 1, maximum: 5, example: 3 },
          idade: { type: "integer", minimum: 16, maximum: 99, example: 21 },
        },
      },
      AlunoInput: {
        type: "object",
        required: ["nome", "apelido", "idCurso", "anoCurricular"],
        properties: {
          nome: { type: "string", minLength: 2, maxLength: 60 },
          apelido: { type: "string", minLength: 2, maxLength: 60 },
          idCurso: { type: "integer", minimum: 1, description: "Tem de ser o id de um curso existente" },
          anoCurricular: { type: "integer", minimum: 1, maximum: 5 },
          idade: { type: "integer", minimum: 16, maximum: 99 },
        },
      },
      Curso: {
        type: "object",
        properties: {
          id: { type: "integer", example: 3 },
          nomeDoCurso: { type: "string", example: "Engenharia Informática" },
        },
      },
      CursoInput: {
        type: "object",
        required: ["nomeDoCurso"],
        properties: { nomeDoCurso: { type: "string", minLength: 3, maxLength: 120 } },
      },
      Erro: {
        type: "object",
        properties: {
          erro: { type: "string", example: "Dados inválidos." },
          detalhes: {
            type: "array",
            items: { type: "object", properties: { campo: { type: "string" }, mensagem: { type: "string" } } },
          },
        },
      },
    },
  },
};
