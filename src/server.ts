import express from 'express';
import bodyParser from 'body-parser';

import { CurrencyController } from './controllers/currency.controller';
import { injectable, inject } from 'inversify';
import { ExchangeController } from './controllers/exchange.controller';

@injectable()
export class Server {
    public server: express.Express;

    /**
     *
     */
    constructor(
        @inject(CurrencyController) private currencyController: CurrencyController,
        @inject(ExchangeController) private exchangeController: ExchangeController
    ) {
        this.server = express();
        this.server.use(bodyParser.json());

        this.setupRoutes();
    }
    
    /**
     * Setup the routes for the API server
     */
    private setupRoutes(): void {
        this.server.get('/currencies/:currencyId', this.currencyController.getCurrencyById);
        this.server.get('/currencies', this.currencyController.getAllCurrencies);
        this.server.post('/currencies', this.currencyController.insertOrUpdateCurrency);

        this.server.get('/exchange', this.exchangeController.convertCurrency);
    }    
}
