# koa-graphql-users

**English** | [Português](README.pt-BR.md)

A **code-first** GraphQL users CRUD on Koa, MongoDB (Mongoose) and TypeScript running directly on Node, with no build step. JWT login and one authenticated route, `GET /me`.

## Stack

- **Node.js ≥ 24** running `.ts` natively (type stripping), with `--watch`, `--env-file` and `node:test`
- **Koa 3** + `@koa/router`
- Code-first **GraphQL** (`graphql-js`) served by `graphql-yoga` inside Koa
- **MongoDB** through **Mongoose**; `docker-compose` for development and `mongodb-memory-server` in tests
- **JWT** (`jsonwebtoken`, HS256) and passwords hashed with `node:crypto` `scrypt`

## Why Koa

Koa was picked because it is a minimal, modern core that lets the app wire in only what it needs. Here almost everything goes through GraphQL, and HTTP is only the transport.

- **vs Express:** Koa was built around `async/await`. Its "onion" middleware (`await next()`) can act before and after the handler, and async errors are caught with a plain `try/catch`, with no `next(err)`. `ctx` brings request and response together, and nothing comes built in (body parser, view engine, router), so the core is much smaller. The `/me` route shows this: the `authenticate` middleware resolves the user and stops with `ctx.throw(401)`, and the handler only reads `ctx.state.user`.
- **vs Fastify:** Fastify wins on raw throughput and ships JSON Schema validation and serialization, encapsulated plugins and lifecycle hooks. Those features are worth little when the schema and validation already live in the GraphQL layer. Koa gives the same `async` model with a smaller API and no conventions to follow, and the performance gap disappears next to the cost of executing GraphQL and querying the database.
- **Trade-off:** Koa's ecosystem is smaller than Express's, and unlike Fastify it has no built-in validation or serialization. That doesn't matter here, because GraphQL already handles both.

## Architecture

```
src/
  index.ts              # bootstrap: connects to Mongo and starts Koa
  app.ts                # createApp(db, config): Koa routes (/graphql and /me)
  yoga.ts               # GraphQL handler (yoga) with the { db, config } context
  config.ts, context.ts
  db/
    connection.ts       # createDb(uri): Mongoose connection + registered models
    models/user.ts      # user Mongoose schema
  schema/               # Query, Mutation and GraphQLSchema assembled by hand (code-first)
  modules/
    user/
      type.ts           # User GraphQLObjectType
      errors.ts, validation.ts
      resolvers/        # one file per operation: users, user, createUser, updateUser, deleteUser
      repositories/     # data access, one function per file
      routes/me.ts      # GET /me handler
    auth/
      password.ts       # scrypt hash/verify
      token.ts          # JWT sign/verify
      middleware.ts     # Koa Bearer auth middleware
      resolvers/login.ts
test/                   # mirrors src/modules; one in-memory MongoDB for the whole run
```

`createDb` and `createApp` are factories: no singletons, and tests inject an isolated database per test.

## Running

```bash
cp .env.example .env
docker compose up -d
npm install
npm run dev
```

GraphQL at `http://localhost:3333/graphql` (GraphiQL in the browser).

| Variable     | Default                                        |
| ------------ | ---------------------------------------------- |
| `PORT`       | `3333`                                         |
| `MONGO_URI`  | `mongodb://localhost:27017/koa-graphql-users`  |
| `JWT_SECRET` | required                                       |

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

Error codes in `extensions.code`: `BAD_USER_INPUT`, `EMAIL_ALREADY_IN_USE`, `USER_NOT_FOUND`, `INVALID_CREDENTIALS`. `GET /me` answers `401` with no token, an invalid/expired token, or when the user no longer exists.

## Tests

```bash
npm test
```

Only the native test runner: `node --test --test-global-setup=test/global-setup.ts`. The global setup starts **one** `mongodb-memory-server` for the whole run and each test creates its own database (`test-<uuid>`), dropped at the end. Docker is not needed to run the tests.

Other scripts: `npm run typecheck`, `npm run lint:fix`.
