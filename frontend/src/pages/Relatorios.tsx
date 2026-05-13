import { useState } from "react";
import { api } from "../api.ts";

// Tela que demonstra o TEMPLATE METHOD (Relatorio + 3 subclasses no backend).
export default function Relatorios() {
  const [texto, setTexto] = useState("Selecione um relatorio.");

  const buscar = async (tipo: string) => {
    setTexto("Carregando...");
    setTexto(await api.relatorio(tipo));
  };

  return (
    <div>
      <h2>Relatorios</h2>
      <div className="toolbar">
        <button onClick={() => buscar("estoque-baixo")}>Estoque Baixo</button>
        <button onClick={() => buscar("inventario")}>Inventario</button>
        <button onClick={() => buscar("movimentacoes")}>Movimentacoes</button>
      </div>
      <pre>{texto}</pre>
    </div>
  );
}
