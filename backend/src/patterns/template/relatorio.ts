import { ProdutoDAO } from "../../dao/produto.dao.ts";
import { MovimentacaoDAO } from "../../dao/movimentacao.dao.ts";

// TEMPLATE METHOD (exemplo 1): gerar() define o esqueleto fixo.
// Subclasses preenchem APENAS cabecalho, corpo e rodape.
export abstract class Relatorio {
  async gerar(): Promise<string> {
    return `${this.cabecalho()}\n${await this.corpo()}\n${this.rodape()}`;
  }
  protected abstract cabecalho(): string;
  protected abstract corpo(): Promise<string>;
  protected abstract rodape(): string;
}

export class RelatorioEstoqueBaixo extends Relatorio {
  protected cabecalho() { return "=== ESTOQUE BAIXO ==="; }
  protected async corpo() {
    const produtos = await ProdutoDAO.listar();
    return produtos
      .filter(p => p.quantidade <= p.estoque_minimo)
      .map(p => `${p.nome}  qtd=${p.quantidade}`)
      .join("\n");
  }
  protected rodape() { return "--- fim ---"; }
}

export class RelatorioInventario extends Relatorio {
  private total = 0;
  protected cabecalho() { return "=== INVENTARIO ==="; }
  protected async corpo() {
    this.total = 0;
    const produtos = await ProdutoDAO.listar();
    return produtos.map(p => {
      const sub = Number(p.preco_custo) * p.quantidade;
      this.total += sub;
      return `${p.nome}  qtd=${p.quantidade}  sub=R$${sub.toFixed(2)}`;
    }).join("\n");
  }
  protected rodape() { return `TOTAL: R$ ${this.total.toFixed(2)}`; }
}

export class RelatorioMovimentacao extends Relatorio {
  protected cabecalho() { return "=== MOVIMENTACOES ==="; }
  protected async corpo() {
    const movs = await MovimentacaoDAO.listar();
    return movs.map(m =>
      `${m.data_mov}  produto=${m.produto_id}  ${m.tipo}  qtd=${m.quantidade}`
    ).join("\n");
  }
  protected rodape() { return "--- fim ---"; }
}
