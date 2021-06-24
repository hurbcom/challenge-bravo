export default class Currency {
    constructor (Database) {
        this.Database = Database;
    }

    async listCurrencies () {
        try {
            const currenciesList = await this.Database.query('SELECT code FROM currency');

            return currenciesList.map(currency => currency.code);
        } catch (err) {
            throw err;
        }
    }

    listCurrencyByCode (currencyCode) {
        return this.Database.query('SELECT code FROM currency WHERE code = $1', [ currencyCode ]);
    }

    storeRealCurrency (currencyDTO) {
        return this.Database.query('INSERT INTO currency(code) VALUES ($1)', [ currencyDTO.currencyCode ]);
    }

    async storeFictitiousCurrency (currencyDTO) {
        try {
            return await this.Database.transaction(
                async (transaction) => {
                    const [ newCurrency ] = await this.Database.query(
                        'INSERT INTO currency(code) VALUES ($1) RETURNING id',
                        [ currencyDTO.currencyCode ],
                        { transaction }
                    );

                    await this.Database.query(
                        'INSERT INTO currency_quote(code_id, quote_value) VALUES ($1, $2)',
                        [ newCurrency.id, currencyDTO.currencyQuote ],
                        { transaction }
                    );
                }
            );
        } catch (err) {
            throw err;
        }
    }
};