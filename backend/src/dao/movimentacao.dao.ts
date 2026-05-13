import db from "../db.ts";
import type { Movimentacao } from "../models/index.ts";

export const MovimentacaoDAO = {
  async listar(): Promise<Movimentacao[]> {
    const r = await db.query<Movimentacao>(
      `SELECT * FROM movimentacao ORDER BY data_mov DESC`
    );
    return r.rows;
  },
  async inserir(m: Movimentacao): Promise<Movimentacao> {
    const r = await db.query<Movimentacao>(
      `INSERT INTO movimentacao(produto_id, tipo, quantidade)
       VALUES(${m.produto_id}, '${m.tipo}', ${m.quantidade})
       RETURNING *`
    );
    return r.rows[0];
  },
  async excluir(id: number): Promise<void> {
    await db.query(`DELETE FROM movimentacao WHERE id=${id}`);
  },
};
