import pg from "pg";
import config from "./config.ts";

// SINGLETON 2: pool de conexoes PostgreSQL. UMA UNICA instancia no sistema.
class DB {
  private static instancia: DB;
  readonly pool: pg.Pool;

  private constructor() {
    this.pool = new pg.Pool(config.db);
  }

  static get(): DB {
    if (!DB.instancia) DB.instancia = new DB();
    return DB.instancia;
  }

  query<T extends pg.QueryResultRow = any>(sql: string, params?: any[]) {
    return this.pool.query<T>(sql, params);
  }
}

export default DB.get();
