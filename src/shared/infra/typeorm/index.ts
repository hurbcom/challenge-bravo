import { Connection, createConnection } from "typeorm";

import ORMConfig from "../../../../ormconfig";

export default async (): Promise<Connection> => {
  return createConnection(ORMConfig);
};
