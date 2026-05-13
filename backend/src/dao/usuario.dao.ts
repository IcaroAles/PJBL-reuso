import db from "../db.ts";
import type { Usuario } from "../models/index.ts";

export const UsuarioDAO = {
  async listar(): Promise<Usuario[]> {
    const r = await db.query<Usuario>(`SELECT * FROM usuario ORDER BY nome`);
    return r.rows;
  },
  async inserir(u: Usuario): Promise<Usuario> {
    const r = await db.query<Usuario>(
      `INSERT INTO usuario(nome,email,senha,perfil)
       VALUES('${u.nome}','${u.email}','${u.senha}','${u.perfil ?? "OPERADOR"}')
       RETURNING *`
    );
    return r.rows[0];
  },
  async atualizar(id: number, u: Usuario): Promise<Usuario> {
    const r = await db.query<Usuario>(
      `UPDATE usuario
       SET nome='${u.nome}', email='${u.email}', senha='${u.senha}', perfil='${u.perfil}'
       WHERE id=${id}
       RETURNING *`
    );
    return r.rows[0];
  },
  async excluir(id: number): Promise<void> {
    await db.query(`DELETE FROM usuario WHERE id=${id}`);
  },
};
