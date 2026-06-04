import { PrismaClient } from "@prisma/client";

// SINGLETON do Prisma Client (ORM). Uma unica conexao/pool reaproveitada,
// no mesmo espirito do Config singleton. As classes/models tipados
// (prisma.produto, prisma.fornecedor, ...) foram gerados via Database First:
//   npx prisma db pull   -> introspecta o banco -> prisma/schema.prisma
//   npx prisma generate  -> gera estas classes em node_modules/@prisma/client
export const prisma = new PrismaClient();
