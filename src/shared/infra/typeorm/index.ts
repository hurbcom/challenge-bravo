import { Connection, createConnection } from "typeorm";

import ORMConfig from "../../../../ormconfig";

export default async (host = "postgres_currency"): Promise<Connection> => {
  return createConnection(
    Object.assign(ORMConfig, {
      host,
    })
  );
};
