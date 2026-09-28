# Testes da API (Postman)

Coleção `postman-collection.json` com os pedidos CRUD de **cursos** e **alunos**. Cada pedido tem testes automáticos (código de estado e conteúdo da resposta). A mesma coleção serve para a API simulada (json-server) e para a API real (Express + MongoDB Atlas).

## Pedidos incluídos

| Pasta | Pedido | Esperado |
|---|---|---|
| Cursos | `GET /cursos` | 200, lista não vazia |
| Cursos | `GET /cursos/:id` | 200 |
| Alunos | `GET /alunos` | 200 |
| Alunos | `GET /alunos/:id` | 200 |
| Alunos | `GET /alunos?idCurso=:id` | 200, todos os alunos do curso pedido |
| Alunos | `POST /alunos` | 201, devolve o aluno criado |
| Alunos | `PUT /alunos/:id` | 200, dados atualizados |
| Alunos | `DELETE /alunos/:id` | 200 ou 204 |
| Alunos | `GET /alunos/:id` (depois de apagar) | 404 |

## Variáveis da coleção

| Variável | Valor por defeito | Para que serve |
|---|---|---|
| `baseUrl` | `http://localhost:3000` | Endereço da API a testar |
| `cursoId` | `1` | Curso usado em `GET /cursos/:id` e no filtro por curso |
| `alunoId` | `1` | Aluno usado nos pedidos por id |

O `POST /alunos` guarda o id do aluno criado em `alunoId`, e o `PUT` e o `DELETE` usam-no a seguir. No fim, o último pedido repõe `alunoId` a `1`. Por isso os pedidos devem correr **pela ordem da coleção**.

## Como usar

### No Postman

1. *Import* → escolher `tests/postman-collection.json`.
2. Arrancar a API a testar (ver abaixo).
3. Correr pedidos individuais, ou *Run collection* para executar tudo.

### Na linha de comandos (Newman)

```bash
# API simulada (json-server, porta 3000)
cd mock-server && npm start
npx newman run tests/postman-collection.json

# API real local (Express, porta 3001)
cd backend && npm start
npx newman run tests/postman-collection.json --env-var baseUrl=http://localhost:3001
```

Resultado esperado: 9 pedidos e 18 asserções, sem falhas.

## Notas

- A coleção **escreve dados**: cria um aluno e apaga-o. Na API real isto consome um id (o contador nunca recua), por isso evita corrê-la sem necessidade contra a base de dados de produção.
- No json-server as escritas ficam gravadas em `mock-data/bd.json`. Para repor os dados originais: `git checkout mock-data/bd.json`.
- O teste do `POST` aceita `id` ou `_id` na resposta, para funcionar com qualquer implementação da API.
