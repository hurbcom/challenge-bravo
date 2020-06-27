import express from 'express';
import bodyParser from 'body-parser';

import { CurrencyController } from './controllers/currency.controller';

export class Server {
    public server: express.Express;

    /**
     *
     */
    constructor(
        private currencyController: CurrencyController
    ) {
        this.server = express();
        this.server.use(bodyParser.json());

        this.setupRoutes();
    }
    
    /**
     * Setup the routes for the API server
     */
    private setupRoutes(): void {
        this.server.get('/currency/', this.currencyController.getCurrencyById);
    }    
}
