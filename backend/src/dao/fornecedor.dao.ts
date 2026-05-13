import db from "../db.ts";
import type { Fornecedor } from "../models/index.ts";

export const FornecedorDAO = {
  async listar(): Promise<Fornecedor[]> {
    const r = await db.query<Fornecedor>(`SELECT * FROM fornecedor ORDER BY nome`);
    return r.rows;
  },
  async inserir(f: Fornecedor): Promise<Fornecedor> {
    const r = await db.query<Fornecedor>(
      `INSERT INTO fornecedor(nome,cnpj,cidade)
       VALUES('${f.nome}','${f.cnpj ?? ""}','${f.cidade ?? ""}')
       RETURNING *`
    );
    return r.rows[0];
  },
  async atualizar(id: number, f: Fornecedor): Promise<Fornecedor> {
    const r = await db.query<Fornecedor>(
      `UPDATE fornecedor
       SET nome='${f.nome}', cnpj='${f.cnpj ?? ""}', cidade='${f.cidade ?? ""}'
       WHERE id=${id}
       RETURNING *`
    );
    return r.rows[0];
  },
  async excluir(id: number): Promise<void> {
    await db.query(`DELETE FROM fornecedor WHERE id=${id}`);
  },
};
