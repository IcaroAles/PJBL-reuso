# Trabalho escrito — Database First ou ORM?

## Antes de tudo: são coisas de eixos diferentes

A pergunta "Database First ou ORM?" mistura dois conceitos que, na prática,
costumam andar juntos:

- **ORM** (Object-Relational Mapping) é a *ferramenta*: uma biblioteca que mapeia
  tabelas do banco para objetos/classes da linguagem, deixando a gente
  manipular dados como objetos em vez de escrever SQL na mão. Ex.: Prisma,
  Hibernate, Entity Framework, Sequelize.

- **Database First** é uma *abordagem de fluxo de trabalho* dentro do ORM. Ela
  responde "quem nasce primeiro, o banco ou o código?". As duas opções são:
  - **Database First**: o banco já existe (ou é modelado primeiro, em SQL). O
    ORM faz *introspecção* e gera as classes a partir das tabelas.
  - **Code First**: as classes/entidades são escritas primeiro no código e o
    ORM gera o banco a partir delas (via *migrations*).

Ou seja, não é "ORM **ou** Database First": Database First é *uma forma de usar*
o ORM. O contraponto real do Database First é o Code First; e o contraponto do
ORM seria escrever **SQL cru** na mão (que é o que os DAOs deste projeto fazem).

## Como aparece neste projeto

Temos os dois lados convivendo, o que deixa a comparação concreta:

- `/api/*` → acesso com **SQL cru** (`pg` + DAOs). Controle total da query,
  mas todo JOIN, INSERT e tratamento de tipo é escrito à mão.
- `/api/orm/*` → mesmo CRUD via **ORM Prisma**, com as classes geradas por
  **Database First** (`prisma db pull` lê as 9 tabelas e gera o schema; depois
  `prisma generate` cria as classes tipadas).

A diferença fica clara nos endpoints relacionais: `produtos-completos` e
`pedidos-completos` trazem dados de 3–4 tabelas aninhadas usando só `include`,
sem escrever nenhum JOIN.

## Prós e contras

**ORM**
- A favor: menos código repetitivo, segurança de tipos, proteção contra SQL
  injection, troca de banco mais fácil, relações resolvidas com `include`.
- Contra: camada de abstração esconde o SQL gerado; queries muito específicas
  ou de alta performance podem ficar difíceis ou ineficientes; curva de
  aprendizado da ferramenta.

**Database First**
- A favor: ótimo quando o banco **já existe** (sistema legado) ou quando o DBA
  modela o banco primeiro; o banco continua sendo a fonte da verdade; o código
  gerado nunca diverge do schema real.
- Contra: o versionamento do schema vive fora do código; mudança de tabela
  exige rodar a introspecção de novo; menos controle do código gerado.

**Code First** (para contraste)
- A favor: schema versionado junto com o código, *migrations* automáticas, bom
  para projetos novos tocados por devs (sem DBA dedicado).
- Contra: o banco fica "refém" do código; ajustes finos de DDL às vezes
  precisam de SQL manual nas migrations.

## Nossa conclusão (na nossa opinião)

Não existe "melhor" absoluto — depende do contexto:

- **Usar ORM** quase sempre vale a pena para o CRUD do dia a dia: menos código,
  mais segurança e manutenção mais barata. Para relatórios ou queries críticas
  de performance, dá para descer ao SQL cru nesses pontos específicos (foi o
  que fizemos: ORM no CRUD, SQL cru onde já existia).

- Entre **Database First e Code First**, a escolha é sobre *quem manda no
  schema*:
  - Se o banco **já existe** ou é projetado primeiro (caso deste trabalho, com
    o `schema.sql` pronto) → **Database First** é o caminho natural: o banco é a
    fonte da verdade e o ORM só gera as classes a partir dele.
  - Se o projeto **nasce do zero** e o time prefere versionar tudo pelo código →
    **Code First** com migrations tende a ser mais produtivo.

No nosso caso, como já tínhamos o banco modelado em SQL, **Database First com um
ORM** foi a melhor combinação: aproveitamos o schema existente e ganhamos
classes tipadas e CRUD com pouco código, sem abrir mão do SQL cru onde ele faz
diferença.
