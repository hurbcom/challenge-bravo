// import { createConnection } from "typeorm";

// createConnection();

import { createConnection, getConnectionOptions } from "typeorm";

interface IOptions {
    host: string;
}

getConnectionOptions().then((options) => {
    const newOptions = options as IOptions;
    newOptions.host = "database_bravo";
    createConnection({
        ...options,
    });
});
