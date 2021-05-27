import { createConnection } from "typeorm";

import ORMConfig from "../../../../ormconfig";

createConnection(ORMConfig).then((conn) => {
  console.log("database connected!");
  conn.runMigrations();
});
