import { createConnection } from "typeorm";

import ORMConfig from "../../../../ormconfig";

createConnection(ORMConfig).then(() => console.log("database connected"));
