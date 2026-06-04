-- 9 tabelas: usuario, categoria, fornecedor, produto, movimentacao,
-- produto_perecivel, produto_eletronico, pedido, pedido_item
DROP TABLE IF EXISTS pedido_item, pedido, produto_eletronico, produto_perecivel,
                     movimentacao, produto, categoria, fornecedor, usuario CASCADE;

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

-- Especializacao de produto: detalhes so de itens pereciveis (1-para-1 com produto).
CREATE TABLE produto_perecivel (
    id               SERIAL PRIMARY KEY,
    produto_id       INT NOT NULL UNIQUE REFERENCES produto(id) ON DELETE CASCADE,
    lote             VARCHAR(40)  NOT NULL,
    validade         DATE         NOT NULL,
    temperatura_ideal NUMERIC(5,2)
);

-- Especializacao de produto: detalhes so de itens eletronicos (1-para-1 com produto).
CREATE TABLE produto_eletronico (
    id             SERIAL PRIMARY KEY,
    produto_id     INT NOT NULL UNIQUE REFERENCES produto(id) ON DELETE CASCADE,
    voltagem       VARCHAR(10),
    garantia_meses INT          DEFAULT 12,
    fabricante     VARCHAR(80)
);

-- Pedido de compra feito a um fornecedor.
CREATE TABLE pedido (
    id            SERIAL PRIMARY KEY,
    fornecedor_id INT NOT NULL REFERENCES fornecedor(id) ON DELETE RESTRICT,
    data_pedido   TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    status        VARCHAR(20) NOT NULL DEFAULT 'ABERTO'   -- ABERTO / RECEBIDO / CANCELADO
);

-- Itens de um pedido (N produtos por pedido).
CREATE TABLE pedido_item (
    id             SERIAL PRIMARY KEY,
    pedido_id      INT NOT NULL REFERENCES pedido(id) ON DELETE CASCADE,
    produto_id     INT NOT NULL REFERENCES produto(id) ON DELETE RESTRICT,
    quantidade     INT           NOT NULL CHECK (quantidade > 0),
    preco_unitario NUMERIC(12,2) NOT NULL DEFAULT 0
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

INSERT INTO produto_perecivel (produto_id, lote, validade, temperatura_ideal) VALUES
 (1, 'LT-2026-001', '2026-12-31', 22.0);

INSERT INTO produto_eletronico (produto_id, voltagem, garantia_meses, fabricante) VALUES
 (3, 'USB-5V', 12, 'GenericTech');

INSERT INTO pedido (fornecedor_id, status) VALUES
 (1, 'RECEBIDO'),
 (2, 'ABERTO');

INSERT INTO pedido_item (pedido_id, produto_id, quantidade, preco_unitario) VALUES
 (1, 1, 100, 18.00),
 (1, 2,  50,  8.00),
 (2, 3,  20, 25.00);
