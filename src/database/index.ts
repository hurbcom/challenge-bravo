import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    username: "admin",
    password: "admin",
    database: "challenge-bravo",
});

AppDataSource.initialize()
    .then(() => console.log("Data Source has been initialized!"))
    .catch(() => console.log("Error during Data Source initialization"));
