import "dotenv/config";

// SINGLETON 1: configuracao global. Le .env UMA VEZ e expoe para o sistema.
class Config {
  private static instancia: Config;

  readonly port = Number(process.env.PORT ?? 3001);
  readonly db = {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_NAME!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
  };
  readonly edition = process.env.EDITION ?? "BASIC";
  readonly features = {
    relatorios: process.env.FEATURE_RELATORIOS === "true",
    usuarios:   process.env.FEATURE_USUARIOS === "true",
  };

  private constructor() {}

  static get(): Config {
    if (!Config.instancia) Config.instancia = new Config();
    return Config.instancia;
  }
}

export default Config.get();
