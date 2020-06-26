import express, { Express } from "express";
import cors from "cors";
import router from "../../routes";
import { createConnection, Connection } from "typeorm";
import dotenv from "dotenv";

class ApplicationContext {

  express!: Express;
  database!: Connection;

  mount() {
    console.log(`Mounting application...`);
    this.configureEnvironment();
    this.express = express();
    this.registerGlobalMiddlewares();
    this.createDatabaseInstance();
    this.appendRouter();
    this.startRouter();
  }

  configureEnvironment() {
    dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });
  }

  registerGlobalMiddlewares() {
    this.express.use([express.json(), cors()]);
  }

  mountProviders() {
    // TODO: Register provider containers
  }

  appendRouter() {
    this.express.use(router);
  }

  async createDatabaseInstance() {
    this.database = await createConnection();
  }

  startRouter() {
    this.express.listen(process.env.PORT || 3000);
  }
}

export default new ApplicationContext();