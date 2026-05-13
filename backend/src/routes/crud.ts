import { Router, type Request, type Response } from "express";

// Fabrica generica de rotas CRUD: REUSO entre as 5 entidades.
// Mesma logica de listar/inserir/atualizar/excluir compartilhada.
interface DAO<T> {
  listar(): Promise<T[]>;
  inserir(item: T): Promise<T>;
  atualizar(id: number, item: T): Promise<T>;
  excluir(id: number): Promise<void>;
}

export function rotasCRUD<T>(dao: DAO<T>): Router {
  const r = Router();

  r.get("/",         async (_req, res) => res.json(await dao.listar()));
  r.post("/",        async (req, res) => res.json(await dao.inserir(req.body)));
  r.put("/:id",      async (req, res) => res.json(await dao.atualizar(Number(req.params.id), req.body)));
  r.delete("/:id",   async (req, res) => { await dao.excluir(Number(req.params.id)); res.status(204).end(); });

  return r;
}
