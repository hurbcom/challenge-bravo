import knex from "knex";
import env from "../config/envConfig";

export default knex({
    client: "pg",
    connection: env.DATABASE_URL,
});
