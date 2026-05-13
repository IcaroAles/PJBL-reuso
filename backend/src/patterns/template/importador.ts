import type { Produto } from "../../models/index.ts";

// TEMPLATE METHOD (exemplo 3): importar() valida + parseia cada linha.
// Subclasses dizem o que e' linha valida e como vira Produto.
export abstract class Importador {
  importar(linhas: string[]): Produto[] {
    return linhas
      .filter(l => this.linhaValida(l))
      .map(l => this.parsear(l));
  }
  protected abstract linhaValida(linha: string): boolean;
  protected abstract parsear(linha: string): Produto;
}

export class ImportadorCSV extends Importador {
  protected linhaValida(l: string) { return l.includes(";"); }
  protected parsear(l: string): Produto {
    const [sku, nome, qtd] = l.split(";");
    return { sku, nome, quantidade: Number(qtd), preco_custo: 0, preco_venda: 0, estoque_minimo: 0 };
  }
}

export class ImportadorTSV extends Importador {
  protected linhaValida(l: string) { return l.includes("\t"); }
  protected parsear(l: string): Produto {
    const [sku, nome, qtd] = l.split("\t");
    return { sku, nome, quantidade: Number(qtd), preco_custo: 0, preco_venda: 0, estoque_minimo: 0 };
  }
}

export class ImportadorPipe extends Importador {
  protected linhaValida(l: string) { return l.includes("|"); }
  protected parsear(l: string): Produto {
    const [sku, nome, qtd] = l.split("|");
    return { sku, nome, quantidade: Number(qtd), preco_custo: 0, preco_venda: 0, estoque_minimo: 0 };
  }
}
