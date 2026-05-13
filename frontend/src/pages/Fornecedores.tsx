import { TabelaCRUD } from "../components/TabelaCRUD.tsx";
import type { Fornecedor } from "../api.ts";

export default function Fornecedores() {
  return (
    <TabelaCRUD<Fornecedor>
      titulo="Fornecedores"
      recurso="fornecedores"
      valorInicial={{ nome: "", cnpj: "", cidade: "" }}
      colunas={[
        { titulo: "ID",     campo: f => f.id },
        { titulo: "Nome",   campo: f => f.nome },
        { titulo: "CNPJ",   campo: f => f.cnpj },
        { titulo: "Cidade", campo: f => f.cidade },
      ]}
      form={(f, set) => (
        <>
          <div>
            <label>Nome</label>
            <input value={f.nome} onChange={e => set({ ...f, nome: e.target.value })} />
          </div>
          <div>
            <label>CNPJ</label>
            <input value={f.cnpj ?? ""} onChange={e => set({ ...f, cnpj: e.target.value })} />
          </div>
          <div>
            <label>Cidade</label>
            <input value={f.cidade ?? ""} onChange={e => set({ ...f, cidade: e.target.value })} />
          </div>
        </>
      )}
    />
  );
}
