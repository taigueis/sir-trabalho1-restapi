# Atividade Prática #1 – Consumo e Implementação de APIs RESTful

Gestão de alunos e cursos: front-end em HTML/CSS/JS (Fetch API), API simulada com json-server e API real com Node.js, Express e MongoDB Atlas, documentada com Swagger.

O enunciado está em [`README.pdf`](README.pdf) (versão em inglês: [`README.EN.pdf`](README.EN.pdf)).

## Links

| | URL |
|---|---|
| Front-end (público) | https://sir-frontend-alunos.onrender.com |
| API real | https://sir-api-alunos.onrender.com |
| Documentação Swagger | https://sir-api-alunos.onrender.com/api-docs |

> A API está no plano gratuito do Render: depois de uns minutos sem pedidos adormece, e o primeiro pedido pode demorar cerca de um minuto.

## Estrutura

```
frontend/     interface web (index.html, style.css, script.js, config.js)
backend/      API Express + Mongoose (MVC) e Swagger
mock-server/  json-server configurado
mock-data/    bd.json original
tests/        coleção Postman
render.yaml   Blueprint do Render
```

## Correr localmente

Requisitos: Node.js 20+.

### 1. API simulada (json-server) + front-end

```bash
cd mock-server
npm install
npm start          # http://localhost:3000  (API e front-end na mesma porta)
```

Os pedidos de escrita gravam em `mock-data/bd.json`. Para repor os dados: `git checkout mock-data/bd.json`.

### 2. API real (Express + MongoDB Atlas)

```bash
cd backend
npm install
cp .env.example .env    # Windows: copy .env.example .env
# editar .env e preencher MONGODB_URI
npm run seed            # carrega mock-data/bd.json para o Atlas (idempotente)
npm start               # http://localhost:3001  ·  Swagger em /api-docs
```

Para o front-end usar a API real local, editar `frontend/config.js` (`LOCAL_API_BASE = "http://localhost:3001"`) e abrir o front-end pelo json-server (`http://localhost:3000`). O `CORS_ORIGIN=*` do `.env` permite esse acesso entre portas.

Mais detalhes (endpoints, variáveis de ambiente, estrutura) em [`backend/README.md`](backend/README.md).

### 3. Testes (Postman)

Importar `tests/postman-collection.json` no Postman, ou correr:

```bash
npx newman run tests/postman-collection.json                                   # json-server
npx newman run tests/postman-collection.json --env-var baseUrl=http://localhost:3001   # API real
```

A coleção usa a variável `baseUrl` (por defeito `http://localhost:3000`). Atenção: cria e apaga um aluno, o que consome um id.

## Deploy

### MongoDB Atlas

1. Criar um cluster gratuito (M0).
2. **Database Access** → criar um utilizador com papel *Read and write to any database* (usar uma password gerada, sem caracteres especiais).
3. **Network Access** → *Add IP Address* → `0.0.0.0/0` (o Render não tem IP fixo no plano gratuito).
4. **Connect → Drivers** → copiar a connection string e acrescentar o nome da base: `...mongodb.net/gestao_alunos?retryWrites=true&w=majority`.

### API no Render (Web Service)

**Com Blueprint (recomendado):** *New → Blueprint* → escolher este repositório. O `render.yaml` cria a API e o front-end. Quando pedido, preencher `MONGODB_URI`.

**Manualmente:** *New → Web Service* → escolher o repositório e configurar:

| Campo | Valor |
|---|---|
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Health Check Path | `/health` |
| Instance Type | Free |

Em *Environment* definir `MONGODB_URI` (a connection string do Atlas), `NODE_VERSION=22` e `CORS_ORIGIN=*`.

Depois do primeiro deploy, carregar os dados no Atlas uma vez, a partir da tua máquina: `cd backend && npm run seed`.

Verificar: `https://<a-tua-api>.onrender.com/health` deve responder `{"api":"ok","baseDeDados":"ligada"}`, e `/api-docs` mostra o Swagger.

### Front-end (Render Static Site ou Vercel)

1. Editar `frontend/config.js` e pôr o URL da API em `PROD_API_BASE` (sem `/` no fim). Este URL só é usado fora de `localhost`, por isso o desenvolvimento local continua a usar o json-server.
2. Fazer commit e push.
3. Publicar a pasta `frontend/`:
   - **Render:** já vem no `render.yaml` (Static Site com Root Directory `frontend`, Publish Directory `.`, sem build).
   - **Vercel:** *Add New → Project* → escolher o repositório → *Root Directory* `frontend`, *Framework Preset* `Other`, sem Build Command.
4. Voltar à API no Render e mudar `CORS_ORIGIN` para o URL do front-end (sem `/` no fim, por exemplo `https://sir-frontend-alunos.onrender.com`), e guardar.
5. Preencher a tabela de **Links** no topo deste README.

## Git

O repositório usa commits regulares e branches quando justificado. Entrega via GitHub Classroom.
