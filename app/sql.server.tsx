import "dotenv/config";
import {
  SqlFragment,
  Pool as SqlPool,
  PoolClient as SqlPoolClient,
  connect,
} from "@synvox/sql";
import { types } from "@synvox/sql/migrations";
import { resolve } from "node:path";
import pg from "pg";

class Client extends SqlPool {
  pgClient: pg.Pool;
  constructor(pgClient: pg.Pool) {
    super();
    this.pgClient = pgClient;
  }
  async query<T>(
    text: string,
    values: (string | number | boolean | Date | SqlFragment | null)[],
  ): Promise<{ rows: T[] }> {
    const result = await this.pgClient.query(text, values);
    return { rows: result.rows as T[] };
  }
  async isolate(): Promise<IsolatedClient> {
    let pgClient = await this.pgClient.connect();
    return new IsolatedClient(pgClient);
  }
}

class IsolatedClient extends SqlPoolClient {
  pgClient: pg.PoolClient;
  constructor(pgClient: pg.PoolClient) {
    super();
    this.pgClient = pgClient;
  }
  async query<T>(
    text: string,
    values: (string | number | boolean | Date | SqlFragment | null)[],
  ): Promise<{ rows: T[] }> {
    const result = await this.pgClient.query(text, values);
    return { rows: result.rows as T[] };
  }
  async release() {
    this.pgClient.release();
  }
}

export const sql = connect(
  new Client(
    new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  ),
);

export type Sql = typeof sql;

types(sql, resolve("./app/types.ts"), undefined, {
  typeMap: { bigint: "number" },
});
