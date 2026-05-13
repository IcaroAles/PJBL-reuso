import express from "express";
import cors from "cors";
import config from "./config.ts";
import { rotasCRUD } from "./routes/crud.ts";
import { UsuarioDAO } from "./dao/usuario.dao.ts";
import { CategoriaDAO } from "./dao/categoria.dao.ts";
import { FornecedorDAO } from "./dao/fornecedor.dao.ts";
import { ProdutoDAO } from "./dao/produto.dao.ts";
import { MovimentacaoDAO } from "./dao/movimentacao.dao.ts";
import {
  RelatorioEstoqueBaixo, RelatorioInventario, RelatorioMovimentacao,
} from "./patterns/template/relatorio.ts";

const app = express();
app.use(cors());
app.use(express.json());

// CRUDs (toda a logica esta em rotasCRUD - reuso)
app.use("/api/usuarios",      rotasCRUD(UsuarioDAO));
app.use("/api/categorias",    rotasCRUD(CategoriaDAO as any));
app.use("/api/fornecedores",  rotasCRUD(FornecedorDAO as any));
app.use("/api/produtos",      rotasCRUD(ProdutoDAO as any));
app.use("/api/movimentacoes", rotasCRUD(MovimentacaoDAO as any));

// LPS: o frontend consulta este endpoint para saber qual edicao esta ativa.
app.get("/api/config", (_req, res) => {
  res.json({ edition: config.edition, features: config.features });
});

// Demo do Template Method (Relatorio + 3 subclasses)
app.get("/api/relatorios/:tipo", async (req, res) => {
  const mapa: Record<string, any> = {
    "estoque-baixo": new RelatorioEstoqueBaixo(),
    "inventario":    new RelatorioInventario(),
    "movimentacoes": new RelatorioMovimentacao(),
  };
  const rel = mapa[req.params.tipo];
  if (!rel) return res.status(404).json({ erro: "tipo invalido" });
  res.type("text/plain").send(await rel.gerar());
});

app.listen(config.port, () => {
  console.log(`Backend rodando em http://localhost:${config.port}`);
  console.log(`Edition: ${config.edition}`);
});
