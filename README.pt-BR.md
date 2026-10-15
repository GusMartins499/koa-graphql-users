# koa-graphql-users

[English](README.md) | **Português**

CRUD de usuários em GraphQL **code-first** sobre Koa, MongoDB (Mongoose) e TypeScript rodando direto no Node, sem build. Login com JWT e uma rota autenticada `GET /me`.

## Stack

- **Node.js ≥ 24** executando `.ts` nativamente (type stripping), com `--watch`, `--env-file` e `node:test`
- **Koa 3** + `@koa/router`
- **GraphQL** code-first (`graphql-js`) servido pelo `graphql-yoga` dentro do Koa
- **MongoDB** via **Mongoose**; `docker-compose` para desenvolvimento e `mongodb-memory-server` nos testes
- **JWT** (`jsonwebtoken`, HS256) e senhas com `scrypt` do `node:crypto`

## Por que Koa

Koa foi escolhido por ser um núcleo mínimo e moderno, que deixa a aplicação montar só o que precisa — aqui, quase tudo passa pelo GraphQL e o HTTP serve apenas de transporte.

- **vs Express:** Koa nasceu de `async/await`. O middleware em "cebola" (`await next()`) permite agir antes e depois do handler e captura erros assíncronos com um `try/catch` comum, sem `next(err)`. O `ctx` unifica request e response e não traz bagagem embutida (body parser, view engine, router), o que deixa o núcleo bem menor. A rota `/me` mostra isso: o middleware `authenticate` resolve o usuário e encerra com `ctx.throw(401)`, e o handler só lê `ctx.state.user`.
- **vs Fastify:** Fastify vence em throughput bruto e traz validação/serialização por JSON Schema, plugins encapsulados e hooks de ciclo de vida. Esses recursos valem pouco quando o schema e a validação já ficam na camada GraphQL. Koa entrega o mesmo modelo `async` com uma API menor e sem convenções a seguir, e a diferença de desempenho some diante do custo de executar GraphQL e ir ao banco.
- **Contrapartida:** o ecossistema do Koa é menor que o do Express, e ele não tem validação nem serialização nativas como o Fastify. Neste projeto isso não pesa, porque o GraphQL já cobre as duas coisas.

## Arquitetura

```
src/
  index.ts              # bootstrap: conecta no Mongo e sobe o Koa
  app.ts                # createApp(db, config): rotas Koa (/graphql e /me)
  yoga.ts               # handler GraphQL (yoga) com o contexto { db, config }
  config.ts, context.ts
  db/
    connection.ts       # createDb(uri): conexão Mongoose + models registrados
    models/user.ts      # schema Mongoose do usuário
  schema/               # Query, Mutation e GraphQLSchema montados à mão (code-first)
  modules/
    user/
      type.ts           # GraphQLObjectType User
      errors.ts, validation.ts
      resolvers/        # um arquivo por operação: users, user, createUser, updateUser, deleteUser
      repositories/     # acesso ao banco, uma função por arquivo
      routes/me.ts      # handler de GET /me
    auth/
      password.ts       # hash/verify com scrypt
      token.ts          # sign/verify JWT
      middleware.ts     # middleware Koa de autenticação Bearer
      resolvers/login.ts
test/                   # espelha src/modules; um MongoDB em memória para toda a execução
```

`createDb` e `createApp` são factories: nada de singleton, e os testes injetam um banco isolado por teste.

## Rodando

```bash
cp .env.example .env
docker compose up -d
npm install
npm run dev
```

GraphQL em `http://localhost:3333/graphql` (GraphiQL no navegador).

| Variável     | Padrão                                         |
| ------------ | ---------------------------------------------- |
| `PORT`       | `3333`                                         |
| `MONGO_URI`  | `mongodb://localhost:27017/koa-graphql-users`  |
| `JWT_SECRET` | obrigatória                                    |

## API

```graphql
query {
  users { id name email createdAt updatedAt }
  user(id: "...") { id name email }
}

mutation {
  createUser(input: { name: "Ada", email: "ada@example.com", password: "12345678" }) { id }
  updateUser(id: "...", input: { name: "Ada Lovelace" }) { id name }
  deleteUser(id: "...")
  login(input: { email: "ada@example.com", password: "12345678" }) { token user { id } }
}
```

```bash
curl http://localhost:3333/me -H "authorization: Bearer <token>"
```

Códigos de erro em `extensions.code`: `BAD_USER_INPUT`, `EMAIL_ALREADY_IN_USE`, `USER_NOT_FOUND`, `INVALID_CREDENTIALS`. `GET /me` responde `401` sem token, com token inválido/expirado ou se o usuário não existe mais.

## Testes

```bash
npm test
```

Usa apenas o test runner nativo: `node --test --test-global-setup=test/global-setup.ts`. O global setup sobe **um** `mongodb-memory-server` para a execução inteira e cada teste cria seu próprio banco (`test-<uuid>`), que é apagado ao final. Não precisa do Docker para rodar os testes.

Outros scripts: `npm run typecheck`, `npm run lint:fix`.
