import type { Produto } from "../../models/index.ts";

// TEMPLATE METHOD (exemplo 2): exportar() controla cabecalho -> linhas -> rodape.
// Subclasses dizem APENAS como formatar cada parte (CSV, JSON, TXT).
export abstract class Exportador {
  exportar(produtos: Produto[]): string {
    return this.cabecalho()
      + produtos.map(p => this.linha(p)).join("")
      + this.rodape();
  }
  protected abstract cabecalho(): string;
  protected abstract linha(p: Produto): string;
  protected abstract rodape(): string;
}

export class ExportadorCSV extends Exportador {
  protected cabecalho() { return "id;sku;nome;qtd;preco\n"; }
  protected linha(p: Produto) {
    return `${p.id};${p.sku};${p.nome};${p.quantidade};${p.preco_venda}\n`;
  }
  protected rodape() { return ""; }
}

export class ExportadorJSON extends Exportador {
  protected cabecalho() { return "[\n"; }
  protected linha(p: Produto) {
    return `  {"sku":"${p.sku}","nome":"${p.nome}","qtd":${p.quantidade},"preco":${p.preco_venda}},\n`;
  }
  protected rodape() { return "]\n"; }
}

export class ExportadorTXT extends Exportador {
  protected cabecalho() { return "--- PRODUTOS ---\n"; }
  protected linha(p: Produto) {
    return `${p.sku}  ${p.nome}  qtd=${p.quantidade}\n`;
  }
  protected rodape() { return "--- fim ---\n"; }
}
