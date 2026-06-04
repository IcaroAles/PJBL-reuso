import { Router, type Request, type Response } from "express";
import { prisma } from "./prisma.ts";

// Fabrica generica de rotas CRUD sobre um "delegate" do Prisma (ORM).
// MESMO padrao de reuso do routes/crud.ts, mas aqui quem fala com o banco
// e o ORM (prisma.<model>) em vez de SQL cru no DAO.
// Um delegate do Prisma expoe findMany / create / update / delete para
// qualquer model, entao uma unica funcao serve as 9 entidades.
interface PrismaDelegate {
  findMany: (args?: any) => Promise<any[]>;
  create: (args: any) => Promise<any>;
  update: (args: any) => Promise<any>;
  delete: (args: any) => Promise<any>;
}

const tratar = (fn: (req: Request, res: Response) => Promise<any>) =>
  async (req: Request, res: Response) => {
    try { await fn(req, res); }
    catch (e: any) {
      // Prisma usa codigos P2002 (unico) / P2003 (FK) / P2025 (nao encontrado).
      const msg = e?.code === "P2002" ? "Valor duplicado (campo unico ja existe)."
                : e?.code === "P2003" ? "Violacao de chave estrangeira."
                : e?.code === "P2025" ? "Registro nao encontrado."
                : e?.message ?? "Erro ao processar requisicao.";
      res.status(400).json({ erro: msg });
    }
  };

// Remove campos que nao sao colunas escalares antes de gravar (id e objetos
// de relacao que o front possa ter trazido junto).
function limparBody(body: any) {
  const { id, ...resto } = body ?? {};
  for (const k of Object.keys(resto)) {
    if (resto[k] !== null && typeof resto[k] === "object") delete resto[k];
  }
  return resto;
}

export function rotasORM(delegate: PrismaDelegate): Router {
  const r = Router();

  r.get("/",       tratar(async (_req, res) => res.json(await delegate.findMany())));
  r.post("/",      tratar(async (req,  res) => res.json(await delegate.create({ data: limparBody(req.body) }))));
  r.put("/:id",    tratar(async (req,  res) => res.json(await delegate.update({ where: { id: Number(req.params.id) }, data: limparBody(req.body) }))));
  r.delete("/:id", tratar(async (req,  res) => { await delegate.delete({ where: { id: Number(req.params.id) } }); res.status(204).end(); }));

  return r;
}

// Rotas relacionais que mostram o GANHO do ORM: navegacao entre tabelas
// sem escrever JOIN na mao, via `include`.
export function rotasORMRelacionais(): Router {
  const r = Router();

  // Produtos com categoria, fornecedor e suas especializacoes 1-para-1.
  r.get("/produtos-completos", tratar(async (_req, res) => {
    res.json(await prisma.produto.findMany({
      include: {
        categoria: true,
        fornecedor: true,
        produto_perecivel: true,
        produto_eletronico: true,
      },
    }));
  }));

  // Pedidos com fornecedor e itens (com o produto de cada item) aninhados.
  r.get("/pedidos-completos", tratar(async (_req, res) => {
    res.json(await prisma.pedido.findMany({
      include: {
        fornecedor: true,
        pedido_item: { include: { produto: true } },
      },
    }));
  }));

  return r;
}
