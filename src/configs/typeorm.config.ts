import { DataSourceOptions, DataSource } from "typeorm";
require('dotenv/config');

export const typeormConfigs: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_SCHEMA,
  entities: [__dirname + '/../modules/**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  synchronize: false,
  migrationsRun: false,
  logging: process.env.NODE_ENV === 'development' ? true : false,
};

export const AppDataSource: DataSource = new DataSource(typeormConfigs as DataSourceOptions);

