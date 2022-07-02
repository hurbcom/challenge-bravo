import { DataSource } from "typeorm";
import "reflect-metadata";
require('dotenv').config();

const host = process.env.NODE_ENV === "dockerdev" ? "postgres" : "localhost";

export const AppDataSource =
  process.env.NODE_ENV === "test"
    ? new DataSource({
        type: "sqlite",
        database: ":memory:",
        entities: ["src/entities/**/*.ts"],
        synchronize: true,
      })
    : new DataSource({
        type: "postgres",
        host,
        port: 5433,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        synchronize: true,
        logging: false,
        entities: ["src/entities/**/*.ts"],
        migrations: ["src/migrations/**/*.ts"],
      });