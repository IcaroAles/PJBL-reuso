import type { Produto } from "../../models/index.ts";

// STRATEGY (exemplo 2): como calcular o preco de venda? 3 politicas plugaveis.
export interface PrecoVenda {
  calcular(p: Produto): number;
}

// Soma um valor fixo em R$ ao custo.
export class MargemFixa implements PrecoVenda {
  constructor(private margem: number) {}
  calcular(p: Produto) { return Number(p.preco_custo) + this.margem; }
}

// Aplica percentual sobre o custo (ex.: 50 => custo * 1.5).
export class Markup implements PrecoVenda {
  constructor(private percentual: number) {}
  calcular(p: Produto) { return Number(p.preco_custo) * (1 + this.percentual / 100); }
}

// Estoque baixo => +10%. Estoque alto => -10%. Caso contrario, markup base.
export class PrecoDinamico implements PrecoVenda {
  calcular(p: Produto) {
    const base = Number(p.preco_custo) * 1.5;
    if (p.quantidade <= p.estoque_minimo)        return base * 1.10;
    if (p.quantidade > p.estoque_minimo * 3)     return base * 0.90;
    return base;
  }
}
