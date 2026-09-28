# Backend – API RESTful (Express + MongoDB Atlas)

API de alunos e cursos com Node.js, Express e Mongoose (MVC). Equivalente à API simulada do `mock-server`.

## Arrancar

```bash
cd backend
npm install
cp .env.example .env      # Windows: copy .env.example .env  (e preencher MONGODB_URI)
npm run seed              # carrega ../mock-data/bd.json para o MongoDB (opcional, idempotente)
npm start                 # ou: npm run dev (reinicia ao editar)
```

A API fica em `http://localhost:3001` e a documentação Swagger em `http://localhost:3001/api-docs`.

Sem `MONGODB_URI` configurada a API arranca na mesma, mostra um aviso na consola e responde `503` em `/alunos` e `/cursos`.

## Variáveis de ambiente

| Variável | Descrição | Por defeito |
|---|---|---|
| `MONGODB_URI` | Connection string do MongoDB Atlas | – |
| `PORT` | Porta HTTP | `3001` |
| `CORS_ORIGIN` | Origens permitidas (separadas por vírgula) | `*` |

## Endpoints

| Método | Rota | Resposta |
|---|---|---|
| GET | `/alunos` (`?idCurso=`) | 200 |
| GET | `/alunos/:id` | 200 / 404 |
| POST | `/alunos` | 201 / 400 |
| PUT | `/alunos/:id` | 200 / 400 / 404 |
| PATCH | `/alunos/:id` | 200 / 400 / 404 |
| DELETE | `/alunos/:id` | 204 / 404 |
| GET, POST | `/cursos` | 200 / 201 / 400 |
| GET, PUT, PATCH, DELETE | `/cursos/:id` | 200 / 204 / 400 / 404 / 409 (curso com alunos) |
| GET | `/health` | 200 (BD ligada) / 503 |

Os ids são inteiros sequenciais (como no json-server), não o `_id` do Mongo, para o front-end e a coleção Postman funcionarem nas duas APIs.

## Estrutura

```
server.js            arranque
src/app.js           Express, CORS, rotas, Swagger
src/config/          ligação à BD
src/models/          Aluno, Curso, Counter (ids sequenciais)
src/controllers/     lógica dos endpoints
src/routes/          rotas
src/middleware/      erros e verificação da BD
src/seed.js          carga de dados
docs/swagger.js      especificação OpenAPI
```

## Testes

Correr a coleção `../tests/postman-collection.json` (Postman ou `npx newman run`) com `baseUrl=http://localhost:3001`.
