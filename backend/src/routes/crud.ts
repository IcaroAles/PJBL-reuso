import { Router, type Request, type Response } from "express";

// Fabrica generica de rotas CRUD: REUSO entre as 5 entidades.
// Mesma logica de listar/inserir/atualizar/excluir compartilhada.
interface DAO<T> {
  listar(): Promise<T[]>;
  inserir(item: T): Promise<T>;
  atualizar(id: number, item: T): Promise<T>;
  excluir(id: number): Promise<void>;
}

// Captura erros do DAO/Postgres e devolve 400 com mensagem amigavel,
// em vez de derrubar o processo via unhandled rejection.
const tratar = (fn: (req: Request, res: Response) => Promise<any>) =>
  async (req: Request, res: Response) => {
    try { await fn(req, res); }
    catch (e: any) {
      const msg = e?.code === "23505" ? "Valor duplicado (campo unico ja existe)."
                : e?.code === "23502" ? "Campo obrigatorio vazio."
                : e?.message ?? "Erro ao processar requisicao.";
      res.status(400).json({ erro: msg });
    }
  };

export function rotasCRUD<T>(dao: DAO<T>): Router {
  const r = Router();

  r.get("/",       tratar(async (_req, res) => res.json(await dao.listar())));
  r.post("/",      tratar(async (req,  res) => res.json(await dao.inserir(req.body))));
  r.put("/:id",    tratar(async (req,  res) => res.json(await dao.atualizar(Number(req.params.id), req.body))));
  r.delete("/:id", tratar(async (req,  res) => { await dao.excluir(Number(req.params.id)); res.status(204).end(); }));

  return r;
}
