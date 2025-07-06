import { resolve } from "node:path";
import { sql } from "../app/sql.server.js";

async function main() {
  const { migrate } = await import("@synvox/sql/migrations");
  await migrate(sql, resolve("migrations"));
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
