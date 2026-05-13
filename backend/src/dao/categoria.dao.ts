import db from "../db.ts";
import type { Categoria } from "../models/index.ts";

export const CategoriaDAO = {
  async listar(): Promise<Categoria[]> {
    const r = await db.query<Categoria>(`SELECT * FROM categoria ORDER BY nome`);
    return r.rows;
  },
  async inserir(c: Categoria): Promise<Categoria> {
    const r = await db.query<Categoria>(
      `INSERT INTO categoria(nome) VALUES('${c.nome}') RETURNING *`
    );
    return r.rows[0];
  },
  async atualizar(id: number, c: Categoria): Promise<Categoria> {
    const r = await db.query<Categoria>(
      `UPDATE categoria SET nome='${c.nome}' WHERE id=${id} RETURNING *`
    );
    return r.rows[0];
  },
  async excluir(id: number): Promise<void> {
    await db.query(`DELETE FROM categoria WHERE id=${id}`);
  },
};
