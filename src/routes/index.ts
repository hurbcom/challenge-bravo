import { Express } from 'express'
import { currencyRoutes } from './currency.routes';
    
export const appRoutes = (app: Express) => {
  app.use("/currency", currencyRoutes());
}      