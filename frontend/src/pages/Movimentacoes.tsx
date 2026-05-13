import { useEffect, useState } from "react";
import { TabelaCRUD } from "../components/TabelaCRUD.tsx";
import { api, type Movimentacao, type Produto } from "../api.ts";

const inicial: Movimentacao = { produto_id: 0, tipo: "ENTRADA", quantidade: 0 };

export default function Movimentacoes() {
  // Carrega os produtos para popular o dropdown e mostrar o nome na tabela.
  const [produtos, setProdutos] = useState<Produto[]>([]);
  useEffect(() => { api.listar<Produto>("produtos").then(setProdutos); }, []);

  const nomeProduto = (id: number) =>
    produtos.find(p => p.id === id)?.nome ?? `#${id}`;

  return (
    <TabelaCRUD<Movimentacao>
      titulo="Movimentacoes"
      recurso="movimentacoes"
      valorInicial={inicial}
      colunas={[
        { titulo: "ID",      campo: m => m.id },
        { titulo: "Produto", campo: m => nomeProduto(m.produto_id) },
        { titulo: "Tipo",    campo: m => m.tipo },
        { titulo: "Qtd",     campo: m => m.quantidade },
        { titulo: "Data",    campo: m => m.data_mov?.substring(0,19).replace("T", " ") },
      ]}
      form={(m, set) => (
        <>
          <div><label>Produto</label>
            <select value={m.produto_id}
                    onChange={e => set({ ...m, produto_id: Number(e.target.value) })}>
              <option value={0}>-- selecione --</option>
              {produtos.map(p => (
                <option key={p.id} value={p.id}>{p.nome} (estoque: {p.quantidade})</option>
              ))}
            </select>
          </div>
          <div><label>Tipo</label>
            <select value={m.tipo} onChange={e => set({ ...m, tipo: e.target.value as any })}>
              <option value="ENTRADA">ENTRADA</option>
              <option value="SAIDA">SAIDA</option>
            </select>
          </div>
          <div><label>Quantidade</label>
            <input type="number" value={m.quantidade}
                   onChange={e => set({ ...m, quantidade: Number(e.target.value) })} /></div>
        </>
      )}
    />
  );
}
