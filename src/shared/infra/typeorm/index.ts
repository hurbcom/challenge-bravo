import { createConnection } from "typeorm";

import { ormConfig } from "../../../../ormconfig";

createConnection(ormConfig).then(() => console.log("database connected"));
