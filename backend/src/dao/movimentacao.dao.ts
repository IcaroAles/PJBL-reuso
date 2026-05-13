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
    // 1. registra a movimentacao
    const r = await db.query<Movimentacao>(
      `INSERT INTO movimentacao(produto_id, tipo, quantidade)
       VALUES(${m.produto_id}, '${m.tipo}', ${m.quantidade})
       RETURNING *`
    );

    // 2. atualiza o estoque do produto (ENTRADA soma, SAIDA subtrai)
    const sinal = m.tipo === "ENTRADA" ? "+" : "-";
    await db.query(
      `UPDATE produto SET quantidade = quantidade ${sinal} ${m.quantidade}
       WHERE id = ${m.produto_id}`
    );

    return r.rows[0];
  },
  async excluir(id: number): Promise<void> {
    // ao excluir, desfaz o efeito no estoque
    const sel = await db.query<Movimentacao>(
      `SELECT * FROM movimentacao WHERE id = ${id}`
    );
    const m = sel.rows[0];
    if (m) {
      const sinal = m.tipo === "ENTRADA" ? "-" : "+";
      await db.query(
        `UPDATE produto SET quantidade = quantidade ${sinal} ${m.quantidade}
         WHERE id = ${m.produto_id}`
      );
    }
    await db.query(`DELETE FROM movimentacao WHERE id=${id}`);
  },
};
