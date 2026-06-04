# PJBL Reuso - Sistema de Estoque
# !!!VIDEO SOLICITADO SOBRE COMPACTAÇÃO ESTA NO REPO E SE CHAMA COMPACTVID.MP4!!!

Trabalho de reuso de software. Backend em Node + TypeScript, frontend em React, banco PostgreSQL.



## Requisitos

- Node.js 20 ou superior
- PostgreSQL 14 ou superior
- npm (vem junto com o Node)

## Como rodar

1. Cria o banco e roda o schema:

```
psql -U postgres -c "CREATE DATABASE estoque_reuso;"
psql -U postgres -d estoque_reuso -f sql/schema.sql
```

2. Ajusta a senha do banco no arquivo `backend/.env` (campo `DB_PASSWORD`).

3. Sobe o backend (terminal 1):

```
cd backend
npm install
npm run dev
```

4. Sobe o frontend (terminal 2):

```
cd frontend
npm install
npm run dev
```

5. Abre http://localhost:5173 no navegador.

## Trocando a edicao (LPS)

Edita `backend/.env`, troca `EDITION=PLUS` por `BASIC` ou `ENTERPRISE`, reinicia o backend e atualiza o navegador. O menu muda conforme a edicao ativa.

## ORM e Database First

O projeto tambem expoe as entidades via ORM **Prisma**, lado a lado com o acesso `pg` cru: `/api/*` usa SQL cru, `/api/orm/*` usa o ORM. As classes do Prisma sao geradas a partir do banco existente (Database First):

```
docker compose up -d        # sobe o Postgres e roda o schema
cd backend && npm install
npx prisma db pull          # introspecta o banco -> prisma/schema.prisma
npx prisma generate         # gera as classes tipadas (Prisma Client)
npx prisma studio           # telas CRUD auto-geradas (http://localhost:5555)
npm run dev
```

Guia completo da entrega em `entrega/ENTREGA-ORM.md`; trabalho escrito (Database First vs ORM) em `entrega/TRABALHO-ESCRITO.md`.
