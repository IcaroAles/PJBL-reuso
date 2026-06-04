# Entrega — ORM e Database First

Backend: Node + TypeScript + Express. ORM: **Prisma**. Banco: **PostgreSQL**.
O ORM convive **lado a lado** com o acesso via `pg` cru (DAOs) que ja existia:
`/api/*` usa SQL cru; `/api/orm/*` usa o ORM.

---

## Parte 01 — Sistema conectando com o banco

Banco sobe via Docker (ja roda o `sql/schema.sql` na primeira vez):

```bash
docker compose up -d
```

Backend conecta e responde:

```bash
cd backend
npm install
npm run dev          # http://localhost:3001
```

Teste rapido (pg cru): `GET http://localhost:3001/api/produtos`

---

## Parte 02 — Database First + ORM

### Database First (o banco gera o codigo)

O banco e a fonte da verdade. O Prisma faz **introspeccao** das tabelas
existentes e gera o schema e as classes automaticamente:

```bash
cd backend

# 1) Le as 9 tabelas do Postgres e gera/atualiza prisma/schema.prisma
npx prisma db pull

# 2) Gera as classes tipadas (Prisma Client) a partir do schema
npx prisma generate
```

> `prisma/schema.prisma` NAO foi escrito a mao — e o resultado do `db pull`.

### Telas/CRUD gerados automaticamente

O Prisma Studio sobe uma interface de administracao (listar/inserir/editar/
excluir) de **todas as tabelas**, gerada automaticamente a partir do schema:

```bash
npx prisma studio       # abre http://localhost:5555
```

### ORM rodando (rotas /api/orm/*)

As mesmas entidades expostas via ORM, em vez de SQL cru:

| Recurso (ORM)                         | Model Prisma          |
|---------------------------------------|-----------------------|
| `GET /api/orm/produtos`               | `prisma.produto`      |
| `GET /api/orm/fornecedores`           | `prisma.fornecedor`   |
| `GET /api/orm/categorias`             | `prisma.categoria`    |
| `GET /api/orm/usuarios`               | `prisma.usuario`      |
| `GET /api/orm/movimentacoes`          | `prisma.movimentacao` |
| `GET /api/orm/produtos-pereciveis`    | `prisma.produto_perecivel` |
| `GET /api/orm/produtos-eletronicos`   | `prisma.produto_eletronico` |
| `GET /api/orm/pedidos`                | `prisma.pedido`       |
| `GET /api/orm/pedido-itens`           | `prisma.pedido_item`  |

Cada recurso aceita `GET / POST / PUT /:id / DELETE /:id` (factory generica
em `backend/src/orm/routesORM.ts`).

Endpoints relacionais que mostram o ganho do ORM (sem escrever JOIN na mao):

- `GET /api/orm/produtos-completos` — produto + categoria + fornecedor + especializacoes
- `GET /api/orm/pedidos-completos`  — pedido + fornecedor + itens + produto de cada item

### Classes ORM por integrante (>= 2 por pessoa)

9 models gerados via Database First. Distribuicao (preencher os nomes):

| Integrante         | Classes ORM (models)                       |
|--------------------|--------------------------------------------|
| Gabriel Fernandes  | `usuario`, `categoria`                     |
| Icaro Nery         | `fornecedor`, `produto`                    |
| Joao Delrey        | `movimentacao`, `produto_perecivel`        |
| Gustavo Gaspar     | `produto_eletronico`, `pedido`             |
| (coletivo)         | `pedido_item`                              |

---

## Arquivos relevantes

- `backend/prisma/schema.prisma` — schema gerado pelo `db pull` (Database First)
- `backend/src/orm/prisma.ts` — singleton do Prisma Client
- `backend/src/orm/routesORM.ts` — CRUD generico via ORM + rotas relacionais
- `backend/src/server.ts` — monta `/api/orm/*` ao lado de `/api/*`
- `sql/schema.sql` — DDL das 9 tabelas
