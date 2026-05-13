import { TabelaCRUD } from "../components/TabelaCRUD.tsx";
import type { Usuario } from "../api.ts";

export default function Usuarios() {
  return (
    <TabelaCRUD<Usuario>
      titulo="Usuarios"
      recurso="usuarios"
      valorInicial={{ nome: "", email: "", senha: "", perfil: "OPERADOR" }}
      colunas={[
        { titulo: "ID",     campo: u => u.id },
        { titulo: "Nome",   campo: u => u.nome },
        { titulo: "Email",  campo: u => u.email },
        { titulo: "Perfil", campo: u => u.perfil },
      ]}
      form={(u, set) => (
        <>
          <div>
            <label>Nome</label>
            <input value={u.nome} onChange={e => set({ ...u, nome: e.target.value })} />
          </div>
          <div>
            <label>Email</label>
            <input value={u.email} onChange={e => set({ ...u, email: e.target.value })} />
          </div>
          <div>
            <label>Senha</label>
            <input value={u.senha} onChange={e => set({ ...u, senha: e.target.value })} />
          </div>
          <div>
            <label>Perfil</label>
            <select value={u.perfil} onChange={e => set({ ...u, perfil: e.target.value })}>
              <option value="ADMIN">ADMIN</option>
              <option value="OPERADOR">OPERADOR</option>
            </select>
          </div>
        </>
      )}
    />
  );
}
