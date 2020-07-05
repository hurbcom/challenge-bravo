
import { Sequelize } from 'sequelize-typescript';
import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const sequelize: Sequelize = new Sequelize({
  dialect: process.env.NODE_ENV === 'test' ? 'sqlite' : 'postgres',
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  modelPaths: [__dirname + '/../app/models'],
  storage: process.env.DATABASE_STORAGE,
  logging: false,
  define: {
    underscored: true
  }
});

export default sequelize;