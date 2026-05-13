import { useEffect, useState } from "react";
import { TabelaCRUD } from "../components/TabelaCRUD.tsx";
import { api, type Produto, type Categoria, type Fornecedor } from "../api.ts";

const inicial: Produto = {
  nome: "", sku: "", tipo: "COMUM",
  preco_custo: 0, preco_venda: 0,
  quantidade: 0, estoque_minimo: 0,
  categoria_id: null,
  fornecedor_id: null,
};

export default function Produtos() {
  // Carrega categorias e fornecedores para popular os dropdowns e colunas.
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  useEffect(() => {
    api.listar<Categoria>("categorias").then(setCategorias);
    api.listar<Fornecedor>("fornecedores").then(setFornecedores);
  }, []);

  const nomeCategoria  = (id?: number | null) => categorias.find(c => c.id === id)?.nome ?? "-";
  const nomeFornecedor = (id?: number | null) => fornecedores.find(f => f.id === id)?.nome ?? "-";

  return (
    <TabelaCRUD<Produto>
      titulo="Produtos"
      recurso="produtos"
      valorInicial={inicial}
      colunas={[
        { titulo: "ID",         campo: p => p.id },
        { titulo: "SKU",        campo: p => p.sku },
        { titulo: "Nome",       campo: p => p.nome },
        { titulo: "Categoria",  campo: p => nomeCategoria(p.categoria_id) },
        { titulo: "Fornecedor", campo: p => nomeFornecedor(p.fornecedor_id) },
        { titulo: "Qtd",        campo: p => p.quantidade },
        { titulo: "Venda",      campo: p => `R$ ${Number(p.preco_venda).toFixed(2)}` },
      ]}
      form={(p, set) => (
        <>
          <div><label>Nome</label>
            <input value={p.nome} onChange={e => set({ ...p, nome: e.target.value })} /></div>
          <div><label>SKU</label>
            <input value={p.sku} onChange={e => set({ ...p, sku: e.target.value })} /></div>
          <div><label>Categoria</label>
            <select value={p.categoria_id ?? ""}
                    onChange={e => set({ ...p, categoria_id: e.target.value ? Number(e.target.value) : null })}>
              <option value="">-- nenhuma --</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div><label>Fornecedor</label>
            <select value={p.fornecedor_id ?? ""}
                    onChange={e => set({ ...p, fornecedor_id: e.target.value ? Number(e.target.value) : null })}>
              <option value="">-- nenhum --</option>
              {fornecedores.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
            </select>
          </div>
          <div><label>Custo</label>
            <input type="number" step="0.01" value={p.preco_custo}
                   onChange={e => set({ ...p, preco_custo: Number(e.target.value) })} /></div>
          <div><label>Venda</label>
            <input type="number" step="0.01" value={p.preco_venda}
                   onChange={e => set({ ...p, preco_venda: Number(e.target.value) })} /></div>
          <div><label>Quantidade</label>
            <input type="number" value={p.quantidade}
                   onChange={e => set({ ...p, quantidade: Number(e.target.value) })} /></div>
          <div><label>Estoque minimo</label>
            <input type="number" value={p.estoque_minimo}
                   onChange={e => set({ ...p, estoque_minimo: Number(e.target.value) })} /></div>
        </>
      )}
    />
  );
}
