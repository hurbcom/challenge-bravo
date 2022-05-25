import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (host = "database_challenge_brave"): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      host,
    })
  );
};
