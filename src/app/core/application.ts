import "reflect-metadata";
import express, { Express } from "express";
import cors from "cors";
import routes from "../../routes";
import { createConnection, Connection } from "typeorm";
import dotenv from "dotenv";
import provider from "./providers";

class ApplicationContext {

  public router!: Express;
  public database!: Connection;

  constructor() {
    this.mount();
  }

  mount() {
    this.configureEnvironment();
    this.registerProviders();
    this.createDatabaseInstance();
    this.router = express();
    this.registerGlobalMiddlewares();
    this.appendRoutes();
  }

  configureEnvironment() {
    dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });
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

  async createDatabaseInstance() {
    //this.database = await createConnection();
  }

  bootstrap() {
    const port = process.env.PORT || 3000;
    console.log(`Starting application on port ${port}`);
    this.router.listen(port);
  }
}

export default new ApplicationContext();