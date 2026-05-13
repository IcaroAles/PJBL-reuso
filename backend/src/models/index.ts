// 10 classes/tipos de dominio.

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  perfil?: string;
}

export interface Categoria {
  id?: number;
  nome: string;
}

export interface Fornecedor {
  id?: number;
  nome: string;
  cnpj?: string;
  cidade?: string;
}

export interface Produto {
  id?: number;
  nome: string;
  sku: string;
  tipo?: string;
  preco_custo: number;
  preco_venda: number;
  quantidade: number;
  estoque_minimo: number;
  validade?: string | null;
  garantia_meses?: number | null;
  categoria_id?: number | null;
  fornecedor_id?: number | null;
}

// Especializacao de Produto: vence em uma data.
export class ProdutoPerecivel implements Produto {
  id?: number;
  nome = ""; sku = ""; tipo = "PERECIVEL";
  preco_custo = 0; preco_venda = 0;
  quantidade = 0; estoque_minimo = 0;
  validade: string | null = null;
  vencido(): boolean {
    return !!this.validade && new Date(this.validade) < new Date();
  }
}

// Especializacao de Produto: tem garantia em meses.
export class ProdutoEletronico implements Produto {
  id?: number;
  nome = ""; sku = ""; tipo = "ELETRONICO";
  preco_custo = 0; preco_venda = 0;
  quantidade = 0; estoque_minimo = 0;
  garantia_meses: number | null = null;
}

export interface Movimentacao {
  id?: number;
  produto_id: number;
  tipo: "ENTRADA" | "SAIDA";
  quantidade: number;
  data_mov?: string;
}

export interface Endereco {
  rua: string;
  cidade: string;
  estado: string;
  cep?: string;
}

// Lote de estoque (usado pelas estrategias FIFO/LIFO/FEFO).
export class Lote {
  constructor(
    public produto_id: number,
    public quantidade: number,
    public entrada: Date,
    public validade: Date | null,
  ) {}
}

export class Alerta {
  constructor(public produto: string, public mensagem: string) {}
  toString() { return `${this.produto}: ${this.mensagem}`; }
}
