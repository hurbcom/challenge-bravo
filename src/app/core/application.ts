import "reflect-metadata";
import express, { Express } from "express";
import cors from "cors";
import routes from "../../routes";
import dotenv from "dotenv";
import provider from "@core/providers";
import database from "@config/database";
import { Sequelize } from "sequelize-typescript";
import redis from "redis";

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

class ApplicationContext {

  public router!: Express;
  public database!: Sequelize;
  public cache!: redis.RedisClient;

  constructor() {
    this.mount();
  }

  async mount() {
    this.registerProviders();
    this.router = express();
    this.registerGlobalMiddlewares();
    this.appendRoutes();
    this.connectCache();
    await this.connectDatabase();
  }

  registerGlobalMiddlewares() {
    this.router.use([express.json(), cors()]);
  }

  registerProviders() {
    provider;
  }

  appendRoutes() {
    this.router.use(routes);
  }

  async connectCache() {
    this.cache = redis.createClient({
      port: parseInt(process.env.CACHE_PORT || "6379"),
      host: process.env.CACHE_HOST || "localhost"
    });

    this.cache.on("error", error => {
      console.error(`[CACHE ERROR]: `, error);
    });
  }

  async connectDatabase() {
    this.database = await database.sync();
  }

  async bootstrap() {
    const port = process.env.APP_PORT || 3000;
    console.log(`Starting application on port ${port}`);
    this.router.listen(port);
  }
}

export default new ApplicationContext();