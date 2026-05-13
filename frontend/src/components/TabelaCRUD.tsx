import { useEffect, useState, type ReactNode } from "react";
import { api } from "../api.ts";

// CORACAO DA COMPACTACAO POR REUSO (Q03).
// Toda pagina CRUD usa este componente. Botoes, tabela, selecao e
// salvar/excluir moram aqui UMA UNICA VEZ. As paginas so dizem:
//   - recurso da API (ex.: "produtos")
//   - colunas da tabela
//   - formulario (children)
//   - valor inicial do formulario
export interface Col<T> {
  titulo: string;
  campo: (item: T) => ReactNode;
}

interface Props<T extends { id?: number }> {
  titulo: string;
  recurso: string;
  colunas: Col<T>[];
  valorInicial: T;
  form: (estado: T, set: (t: T) => void) => ReactNode;
}

export function TabelaCRUD<T extends { id?: number }>({
  titulo, recurso, colunas, valorInicial, form,
}: Props<T>) {
  const [itens, setItens] = useState<T[]>([]);
  const [editando, setEditando] = useState<T>(valorInicial);
  const [erro, setErro] = useState("");

  const recarregar = async () => {
    try { setItens(await api.listar<T>(recurso)); }
    catch (e: any) { setErro(e.message); }
  };

  useEffect(() => { recarregar(); }, [recurso]);

  const novo = () => setEditando(valorInicial);

  const salvar = async () => {
    try {
      if (editando.id) await api.atualizar(recurso, editando.id, editando);
      else              await api.inserir(recurso, editando);
      await recarregar();
      novo();
    } catch (e: any) { setErro(e.message); }
  };

  const excluir = async () => {
    if (!editando.id) return;
    if (!confirm("Excluir?")) return;
    await api.excluir(recurso, editando.id);
    await recarregar();
    novo();
  };

  return (
    <div>
      <h2>{titulo}</h2>

      <div className="form-card">
        <div className="form-grid">{form(editando, setEditando)}</div>
        <div className="toolbar" style={{ marginTop: 12 }}>
          <button onClick={salvar}>Salvar</button>
          <button className="secondary" onClick={novo}>Novo</button>
          {editando.id && <button className="danger" onClick={excluir}>Excluir</button>}
        </div>
        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </div>

      <table>
        <thead>
          <tr>{colunas.map(c => <th key={c.titulo}>{c.titulo}</th>)}</tr>
        </thead>
        <tbody>
          {itens.map(it => (
            <tr key={it.id}
                className={editando.id === it.id ? "selecionada" : ""}
                onClick={() => setEditando(it)}>
              {colunas.map(c => <td key={c.titulo}>{c.campo(it)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
