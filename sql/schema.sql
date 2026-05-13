-- 5 tabelas: usuario, categoria, fornecedor, produto, movimentacao
DROP TABLE IF EXISTS movimentacao, produto, categoria, fornecedor, usuario CASCADE;

CREATE TABLE usuario (
    id     SERIAL PRIMARY KEY,
    nome   VARCHAR(120) NOT NULL,
    email  VARCHAR(120) UNIQUE NOT NULL,
    senha  VARCHAR(120) NOT NULL,
    perfil VARCHAR(20)  DEFAULT 'OPERADOR'
);

CREATE TABLE categoria (
    id   SERIAL PRIMARY KEY,
    nome VARCHAR(80) UNIQUE NOT NULL
);

CREATE TABLE fornecedor (
    id     SERIAL PRIMARY KEY,
    nome   VARCHAR(120) NOT NULL,
    cnpj   VARCHAR(20),
    cidade VARCHAR(80)
);

CREATE TABLE produto (
    id             SERIAL PRIMARY KEY,
    nome           VARCHAR(120)   NOT NULL,
    sku            VARCHAR(40)    UNIQUE NOT NULL,
    tipo           VARCHAR(20)    DEFAULT 'COMUM',
    preco_custo    NUMERIC(12,2)  DEFAULT 0,
    preco_venda    NUMERIC(12,2)  DEFAULT 0,
    quantidade     INT            DEFAULT 0,
    estoque_minimo INT            DEFAULT 0,
    validade       DATE,
    garantia_meses INT,
    categoria_id   INT REFERENCES categoria(id) ON DELETE SET NULL,
    fornecedor_id  INT REFERENCES fornecedor(id) ON DELETE SET NULL
);

CREATE TABLE movimentacao (
    id         SERIAL PRIMARY KEY,
    produto_id INT NOT NULL REFERENCES produto(id) ON DELETE CASCADE,
    tipo       VARCHAR(20) NOT NULL,        -- ENTRADA / SAIDA
    quantidade INT NOT NULL,
    data_mov   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- dados de teste
INSERT INTO usuario (nome, email, senha, perfil) VALUES
 ('Admin', 'admin@x.com', '123', 'ADMIN');

INSERT INTO categoria (nome) VALUES ('Alimentos'), ('Limpeza'), ('Eletronicos');

INSERT INTO fornecedor (nome, cnpj, cidade) VALUES
 ('Fornecedor A', '11.111/0001-11', 'Curitiba'),
 ('Fornecedor B', '22.222/0001-22', 'Sao Paulo');

INSERT INTO produto (nome, sku, tipo, preco_custo, preco_venda, quantidade, estoque_minimo, categoria_id, fornecedor_id) VALUES
 ('Arroz 5kg', 'ARR-5KG', 'PERECIVEL', 18, 28, 50, 10, 1, 1),
 ('Sabao 1kg', 'SAB-1KG', 'COMUM',      8, 14, 30,  5, 2, 1),
 ('Mouse USB', 'MOU-USB', 'ELETRONICO',25, 49, 15,  3, 3, 2);
