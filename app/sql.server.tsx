import { connect } from "@synvox/sql";
import pg from "pg";

pg.types.setTypeParser(20, parseInt);

const client = new pg.Pool({
  database: "remix_demo_september_2023",
});

export const sql = connect(client);
