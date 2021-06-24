export default class Currency {
    constructor (Database) {
        this.Database = Database;
    }

    async listAll () {
        try {
            const currenciesList = await this.Database.query('SELECT symbol FROM currency');

            return currenciesList.map(item => item.symbol);
        } catch (err) {
            throw err;
        }
    }

    listBySymbol (symbol) {
        return this.Database.query('SELECT symbol FROM currency WHERE symbol = $1', [symbol]);
    }
    
    storeRealCurrency (currencyDTO) {
        return this.Database.query('INSERT INTO currency(symbol) VALUES ($1)', [currencyDTO.symbol]);
    }

    async storeFictitiousCurrency (currencyDTO) {
        try {
            return await this.Database.transaction(
                async (transaction) => {
                    const [ newCurrency ] = (await this.Database.query(
                        'INSERT INTO currency(symbol) VALUES ($1) RETURNING id',
                        [currencyDTO.symbol],
                        { transaction }
                    ));

                    await this.Database.query(
                        'INSERT INTO currency_quote(symbol_id, quotation) VALUES ($1, $2)',
                        [newCurrency.id, currencyDTO.quotation],
                        { transaction }
                    );
                }
            );
        } catch (err) {
            throw err;
        }
    }
};