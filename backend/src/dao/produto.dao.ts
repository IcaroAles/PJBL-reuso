import db from "../db.ts";
import type { Produto } from "../models/index.ts";

// helpers para montar SQL: trata null e aspas
const s = (v: any) => v == null ? "NULL" : `'${v}'`;
const n = (v: any) => v == null ? "NULL" : String(v);

export const ProdutoDAO = {
  async listar(): Promise<Produto[]> {
    const r = await db.query<Produto>(`SELECT * FROM produto ORDER BY nome`);
    return r.rows;
  },
  async inserir(p: Produto): Promise<Produto> {
    const r = await db.query<Produto>(
      `INSERT INTO produto
       (nome, sku, tipo, preco_custo, preco_venda, quantidade, estoque_minimo,
        validade, garantia_meses, categoria_id, fornecedor_id)
       VALUES (${s(p.nome)}, ${s(p.sku)}, ${s(p.tipo ?? "COMUM")},
               ${p.preco_custo}, ${p.preco_venda},
               ${p.quantidade}, ${p.estoque_minimo},
               ${s(p.validade)}, ${n(p.garantia_meses)},
               ${n(p.categoria_id)}, ${n(p.fornecedor_id)})
       RETURNING *`
    );
    return r.rows[0];
  },
  async atualizar(id: number, p: Produto): Promise<Produto> {
    const r = await db.query<Produto>(
      `UPDATE produto SET
         nome=${s(p.nome)},
         sku=${s(p.sku)},
         tipo=${s(p.tipo ?? "COMUM")},
         preco_custo=${p.preco_custo},
         preco_venda=${p.preco_venda},
         quantidade=${p.quantidade},
         estoque_minimo=${p.estoque_minimo},
         validade=${s(p.validade)},
         garantia_meses=${n(p.garantia_meses)},
         categoria_id=${n(p.categoria_id)},
         fornecedor_id=${n(p.fornecedor_id)}
       WHERE id=${id}
       RETURNING *`
    );
    return r.rows[0];
  },
  async excluir(id: number): Promise<void> {
    await db.query(`DELETE FROM produto WHERE id=${id}`);
  },
};
