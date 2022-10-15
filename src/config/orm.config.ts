import { DataSource } from 'typeorm';
import 'dotenv/config';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOSTNAME,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA,
    entities: [__dirname + '/../modules/**/entities/*.entity.{js,ts}'],
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    migrationsTableName: 'migrations',
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    subscribers: [],
});
