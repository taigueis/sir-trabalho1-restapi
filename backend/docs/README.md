# Documentação da API (Swagger / OpenAPI)

A API é documentada com OpenAPI 3.0 e apresentada com o [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express) na rota **`/api-docs`**.

| Ambiente | URL |
|---|---|
| Produção | https://sir-api-alunos.onrender.com/api-docs |
| Local | http://localhost:3001/api-docs |

Na interface é possível ver os modelos de dados e os códigos de resposta de cada endpoint, e experimentar os pedidos diretamente (*Try it out*).

## Conteúdo

O ficheiro [`swagger.js`](swagger.js) exporta a especificação e documenta:

- **Alunos** — `GET /alunos` (com o filtro `?idCurso=`), `POST /alunos`, `GET`, `PUT`, `PATCH` e `DELETE /alunos/{id}`
- **Cursos** — `GET /cursos`, `POST /cursos`, `GET`, `PUT`, `PATCH` e `DELETE /cursos/{id}`
- **Modelos** — `Aluno`, `AlunoInput`, `Curso`, `CursoInput` e `Erro`, com as mesmas regras de validação dos modelos Mongoose (por exemplo `anoCurricular` de 1 a 5 e `idade` de 16 a 99)
- **Respostas** — 200, 201, 204, 400, 404, 409 (curso com alunos associados) e 503 (base de dados indisponível)

## Como funciona

O `src/app.js` carrega a especificação e serve-a com o Swagger UI:

```js
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

Como alunos e cursos têm as mesmas cinco operações, o `swagger.js` gera-as com uma função auxiliar (`crud`) e só os modelos e os exemplos mudam de um recurso para o outro.

## Manter a documentação atualizada

Ao alterar a API (novo campo, nova rota, novo código de resposta), atualizar o `swagger.js` em conjunto com o modelo e o controller:

1. Campo novo → acrescentar em `components.schemas` (`Aluno` e `AlunoInput`, ou `Curso` e `CursoInput`).
2. Rota nova → acrescentar em `paths`.
3. Reiniciar a API e confirmar em `/api-docs`.

## Exportar a especificação

Para obter o ficheiro OpenAPI em JSON (por exemplo para importar no Postman), a partir da pasta `backend/`:

```bash
node -e "console.log(JSON.stringify(require('./docs/swagger'), null, 2))" > openapi.json
```
