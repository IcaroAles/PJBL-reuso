import { TabelaCRUD } from "../components/TabelaCRUD.tsx";
import type { Movimentacao } from "../api.ts";

const inicial: Movimentacao = { produto_id: 0, tipo: "ENTRADA", quantidade: 0 };

export default function Movimentacoes() {
  return (
    <TabelaCRUD<Movimentacao>
      titulo="Movimentacoes"
      recurso="movimentacoes"
      valorInicial={inicial}
      colunas={[
        { titulo: "ID",       campo: m => m.id },
        { titulo: "Produto",  campo: m => m.produto_id },
        { titulo: "Tipo",     campo: m => m.tipo },
        { titulo: "Qtd",      campo: m => m.quantidade },
        { titulo: "Data",     campo: m => m.data_mov?.substring(0,19).replace("T", " ") },
      ]}
      form={(m, set) => (
        <>
          <div><label>Produto ID</label>
            <input type="number" value={m.produto_id}
                   onChange={e => set({ ...m, produto_id: Number(e.target.value) })} /></div>
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
