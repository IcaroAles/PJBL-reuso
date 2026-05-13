import { useEffect, useState } from "react";
import { api, type Produto } from "../api.ts";

// CRUD especifico para produtos ELETRONICOS (variabilidade LPS - so aparece em ENTERPRISE).
export default function ProdutosEletronicos() {
  const [itens, setItens] = useState<Produto[]>([]);
  const [edit, setEdit] = useState<Produto>({
    nome: "", sku: "", tipo: "ELETRONICO",
    preco_custo: 0, preco_venda: 0, quantidade: 0, estoque_minimo: 0,
    garantia_meses: 12,
  });

  const recarregar = async () => {
    const todos = await api.listar<Produto>("produtos");
    setItens(todos.filter(p => p.tipo === "ELETRONICO"));
  };
  useEffect(() => { recarregar(); }, []);

  const salvar = async () => {
    if (edit.id) await api.atualizar("produtos", edit.id, edit);
    else await api.inserir("produtos", { ...edit, tipo: "ELETRONICO" });
    await recarregar();
    setEdit({ nome: "", sku: "", tipo: "ELETRONICO",
      preco_custo: 0, preco_venda: 0, quantidade: 0, estoque_minimo: 0, garantia_meses: 12 });
  };

  return (
    <div>
      <h2>Produtos Eletronicos</h2>
      <div className="form-card">
        <div className="form-grid">
          <div><label>Nome</label>
            <input value={edit.nome} onChange={e => setEdit({ ...edit, nome: e.target.value })} /></div>
          <div><label>SKU</label>
            <input value={edit.sku} onChange={e => setEdit({ ...edit, sku: e.target.value })} /></div>
          <div><label>Quantidade</label>
            <input type="number" value={edit.quantidade}
                   onChange={e => setEdit({ ...edit, quantidade: Number(e.target.value) })} /></div>
          <div><label>Garantia (meses)</label>
            <input type="number" value={edit.garantia_meses ?? 0}
                   onChange={e => setEdit({ ...edit, garantia_meses: Number(e.target.value) })} /></div>
        </div>
        <div style={{ marginTop: 12 }}>
          <button onClick={salvar}>Salvar</button>
        </div>
      </div>
      <table>
        <thead><tr><th>ID</th><th>SKU</th><th>Nome</th><th>Qtd</th><th>Garantia (m)</th></tr></thead>
        <tbody>
          {itens.map(p => (
            <tr key={p.id} onClick={() => setEdit(p)}>
              <td>{p.id}</td><td>{p.sku}</td><td>{p.nome}</td>
              <td>{p.quantidade}</td><td>{p.garantia_meses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
