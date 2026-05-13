import { useEffect, useState } from "react";
import { api, type Produto } from "../api.ts";

// CRUD especifico para produtos PERECIVEIS (variabilidade LPS - so aparece em ENTERPRISE).
export default function ProdutosPereciveis() {
  const [itens, setItens] = useState<Produto[]>([]);
  const [edit, setEdit] = useState<Produto>({
    nome: "", sku: "", tipo: "PERECIVEL",
    preco_custo: 0, preco_venda: 0, quantidade: 0, estoque_minimo: 0,
    validade: null,
  });

  const recarregar = async () => {
    const todos = await api.listar<Produto>("produtos");
    setItens(todos.filter(p => p.tipo === "PERECIVEL"));
  };
  useEffect(() => { recarregar(); }, []);

  const salvar = async () => {
    if (edit.id) await api.atualizar("produtos", edit.id, edit);
    else await api.inserir("produtos", { ...edit, tipo: "PERECIVEL" });
    await recarregar();
    setEdit({ nome: "", sku: "", tipo: "PERECIVEL",
      preco_custo: 0, preco_venda: 0, quantidade: 0, estoque_minimo: 0, validade: null });
  };

  return (
    <div>
      <h2>Produtos Pereciveis</h2>
      <div className="form-card">
        <div className="form-grid">
          <div><label>Nome</label>
            <input value={edit.nome} onChange={e => setEdit({ ...edit, nome: e.target.value })} /></div>
          <div><label>SKU</label>
            <input value={edit.sku} onChange={e => setEdit({ ...edit, sku: e.target.value })} /></div>
          <div><label>Quantidade</label>
            <input type="number" value={edit.quantidade}
                   onChange={e => setEdit({ ...edit, quantidade: Number(e.target.value) })} /></div>
          <div><label>Validade</label>
            <input type="date" value={edit.validade ?? ""}
                   onChange={e => setEdit({ ...edit, validade: e.target.value })} /></div>
        </div>
        <div style={{ marginTop: 12 }}>
          <button onClick={salvar}>Salvar</button>
        </div>
      </div>
      <table>
        <thead><tr><th>ID</th><th>SKU</th><th>Nome</th><th>Qtd</th><th>Validade</th></tr></thead>
        <tbody>
          {itens.map(p => (
            <tr key={p.id} onClick={() => setEdit(p)}>
              <td>{p.id}</td><td>{p.sku}</td><td>{p.nome}</td>
              <td>{p.quantidade}</td><td>{p.validade?.substring(0,10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
