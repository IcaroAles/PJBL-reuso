import { TabelaCRUD } from "../components/TabelaCRUD.tsx";
import type { Categoria } from "../api.ts";

export default function Categorias() {
  return (
    <TabelaCRUD<Categoria>
      titulo="Categorias"
      recurso="categorias"
      valorInicial={{ nome: "" }}
      colunas={[
        { titulo: "ID",   campo: c => c.id },
        { titulo: "Nome", campo: c => c.nome },
      ]}
      form={(c, set) => (
        <div>
          <label>Nome</label>
          <input value={c.nome} onChange={e => set({ ...c, nome: e.target.value })} />
        </div>
      )}
    />
  );
}
