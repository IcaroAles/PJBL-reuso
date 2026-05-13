import { useEffect, useState } from "react";
import { NavLink, Route, Routes, Navigate } from "react-router-dom";
import { api } from "./api.ts";

import Usuarios from "./pages/Usuarios.tsx";
import Categorias from "./pages/Categorias.tsx";
import Fornecedores from "./pages/Fornecedores.tsx";
import Produtos from "./pages/Produtos.tsx";
import Movimentacoes from "./pages/Movimentacoes.tsx";
import ProdutosPereciveis from "./pages/ProdutosPereciveis.tsx";
import ProdutosEletronicos from "./pages/ProdutosEletronicos.tsx";
import Relatorios from "./pages/Relatorios.tsx";

// VARIABILIDADE LPS: o menu e as rotas mudam conforme a edition que o backend retorna.
// BASIC:      Produtos, Categorias
// PLUS:       BASIC + Fornecedores, Movimentacoes, Usuarios, Relatorios
// ENTERPRISE: PLUS + Produtos Pereciveis, Produtos Eletronicos
export default function App() {
  const [edition, setEdition] = useState("BASIC");
  const [features, setFeatures] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api.config().then(c => { setEdition(c.edition); setFeatures(c.features); });
  }, []);

  const plus       = edition === "PLUS" || edition === "ENTERPRISE";
  const enterprise = edition === "ENTERPRISE";

  return (
    <>
      <header>
        <h1>Stockys [{edition}]</h1>
        <nav>
          <NavLink to="/produtos">Produtos</NavLink>
          <NavLink to="/categorias">Categorias</NavLink>
          {plus && <NavLink to="/fornecedores">Fornecedores</NavLink>}
          {plus && <NavLink to="/movimentacoes">Movimentacoes</NavLink>}
          {features.usuarios && <NavLink to="/usuarios">Usuarios</NavLink>}
          {enterprise && <NavLink to="/pereciveis">Pereciveis</NavLink>}
          {enterprise && <NavLink to="/eletronicos">Eletronicos</NavLink>}
          {features.relatorios && <NavLink to="/relatorios">Relatorios</NavLink>}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/produtos" />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/categorias" element={<Categorias />} />
          {plus && <Route path="/fornecedores" element={<Fornecedores />} />}
          {plus && <Route path="/movimentacoes" element={<Movimentacoes />} />}
          {features.usuarios && <Route path="/usuarios" element={<Usuarios />} />}
          {enterprise && <Route path="/pereciveis" element={<ProdutosPereciveis />} />}
          {enterprise && <Route path="/eletronicos" element={<ProdutosEletronicos />} />}
          {features.relatorios && <Route path="/relatorios" element={<Relatorios />} />}
        </Routes>
      </main>
    </>
  );
}
