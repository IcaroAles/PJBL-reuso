import { Lote } from "../../models/index.ts";

// STRATEGY (exemplo 1): qual lote sai primeiro? 3 politicas plugaveis.
export interface BaixaEstoque {
  ordenar(lotes: Lote[]): Lote[];
}

// Primeiro que entrou, primeiro que sai.
export class FIFO implements BaixaEstoque {
  ordenar(lotes: Lote[]) {
    return [...lotes].sort((a, b) => a.entrada.getTime() - b.entrada.getTime());
  }
}

// Ultimo que entrou, primeiro que sai.
export class LIFO implements BaixaEstoque {
  ordenar(lotes: Lote[]) {
    return [...lotes].sort((a, b) => b.entrada.getTime() - a.entrada.getTime());
  }
}

// Primeiro que vence, primeiro que sai (ideal para alimentos).
export class FEFO implements BaixaEstoque {
  ordenar(lotes: Lote[]) {
    return [...lotes].sort((a, b) => {
      const av = a.validade?.getTime() ?? Infinity;
      const bv = b.validade?.getTime() ?? Infinity;
      return av - bv;
    });
  }
}
