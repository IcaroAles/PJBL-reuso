// Helper unico para chamar a API. Reuso: todas as paginas usam estas 4 funcoes.
const API = "/api";

async function req<T>(url: string, opts?: RequestInit): Promise<T> {
  const r = await fetch(API + url, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!r.ok) throw new Error(await r.text());
  return r.status === 204 ? (undefined as T) : r.json();
}

export const api = {
  listar:    <T>(rec: string) => req<T[]>(`/${rec}`),
  inserir:   <T>(rec: string, body: T) => req<T>(`/${rec}`, { method: "POST", body: JSON.stringify(body) }),
  atualizar: <T>(rec: string, id: number, body: T) => req<T>(`/${rec}/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  excluir:   (rec: string, id: number) => req<void>(`/${rec}/${id}`, { method: "DELETE" }),
  config:    () => req<{ edition: string; features: Record<string, boolean> }>("/config"),
  relatorio: (tipo: string) => fetch(`${API}/relatorios/${tipo}`).then(r => r.text()),
};

// Tipos espelhando o backend
export interface Usuario     { id?: number; nome: string; email: string; senha: string; perfil?: string }
export interface Categoria   { id?: number; nome: string }
export interface Fornecedor  { id?: number; nome: string; cnpj?: string; cidade?: string }
export interface Produto     {
  id?: number; nome: string; sku: string; tipo?: string;
  preco_custo: number; preco_venda: number;
  quantidade: number; estoque_minimo: number;
  validade?: string | null; garantia_meses?: number | null;
  categoria_id?: number | null; fornecedor_id?: number | null;
}
export interface Movimentacao {
  id?: number; produto_id: number; tipo: "ENTRADA" | "SAIDA"; quantidade: number; data_mov?: string;
}
