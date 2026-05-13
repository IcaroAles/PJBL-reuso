import type { Produto } from "../../models/index.ts";

// STRATEGY (exemplo 3): como ordenar a lista? Trocavel em runtime.
export interface Ordenacao {
  ordenar(produtos: Produto[]): Produto[];
}

export class OrdenarPorNome implements Ordenacao {
  ordenar(p: Produto[]) { return [...p].sort((a, b) => a.nome.localeCompare(b.nome)); }
}

export class OrdenarPorQuantidade implements Ordenacao {
  ordenar(p: Produto[]) { return [...p].sort((a, b) => a.quantidade - b.quantidade); }
}

export class OrdenarPorPreco implements Ordenacao {
  ordenar(p: Produto[]) {
    return [...p].sort((a, b) => Number(b.preco_venda) - Number(a.preco_venda));
  }
}
