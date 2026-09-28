# Mock server (json-server)

API simulada com [json-server](https://github.com/typicode/json-server) (versão 0.17.4), usada para desenvolver e testar o front-end antes de existir a API real. Lê os dados de `../mock-data/bd.json`.

## Arrancar

```bash
cd mock-server
npm install
npm start
```

O servidor fica em `http://localhost:3000`. O script `start` executa:

```
json-server --watch ../mock-data/bd.json --port 3000 --static ../frontend
```

| Opção | O que faz |
|---|---|
| `--watch ../mock-data/bd.json` | Usa este ficheiro como base de dados e recarrega-o se mudar |
| `--port 3000` | Porta do servidor (a API real usa a 3001, para não colidirem) |
| `--static ../frontend` | Serve o front-end na raiz (`http://localhost:3000/`), na mesma origem da API, sem problemas de CORS |

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/alunos` | Lista de alunos |
| GET | `/alunos/:id` | Um aluno |
| POST | `/alunos` | Cria um aluno (o `id` é gerado pelo servidor) |
| PUT / PATCH | `/alunos/:id` | Substitui / atualiza parcialmente |
| DELETE | `/alunos/:id` | Remove |
| GET | `/cursos`, `/cursos/:id` | Leitura de cursos (as escritas também funcionam) |

O json-server permite ainda filtros e ordenação por parâmetros, por exemplo:

- `/alunos?idCurso=3` — alunos de um curso
- `/alunos?_sort=nome&_order=asc` — ordenar
- `/alunos?q=silva` — pesquisa de texto

## Dados

`../mock-data/bd.json` tem 8 alunos (`id`, `nome`, `apelido`, `idCurso`, `anoCurricular`, `idade`) e 3 cursos (`id`, `nomeDoCurso`).

Os pedidos de escrita (`POST`, `PUT`, `PATCH`, `DELETE`) **alteram o `bd.json`**. Para repor os dados originais:

```bash
git checkout mock-data/bd.json
```

## Testar

A coleção Postman está em `../tests/` (ver [`tests/README.md`](../tests/README.md)).
