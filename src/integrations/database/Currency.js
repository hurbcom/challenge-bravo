export default class Currency {
    constructor (Database, CurrencyMapper) {
        this.Database = Database;
        this.CurrencyMapper = CurrencyMapper;
    }

    async listCurrencies () {
        try {
            const currenciesList = await this.Database.query('SELECT code FROM currency');

            return currenciesList;
        } catch (err) {
            throw err;
        }
    }

    listCurrencyByCode (currencyCode) {
        return this.Database.query('SELECT id, code FROM currency WHERE code = $1', [ currencyCode ]);
    }

    async listCurrenciesQuoteByCode (...codes) {
        try {
            const currencies = await this.Database.query('SELECT c.id, c.code, cq.quote_value FROM currency c LEFT JOIN currency_quote cq ON c.id = cq.currency_id WHERE c.code in ($1, $2)', [ codes[0], codes[1] ]);

            return currencies.map(currency => this.CurrencyMapper.toDTO(currency));
        } catch (err) {
            throw err;
        }
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
                        'INSERT INTO currency_quote(currency_id, quote_value) VALUES ($1, $2)',
                        [ newCurrency.id, currencyDTO.currencyQuote ],
                        { transaction }
                    );
                }
            );
        } catch (err) {
            throw err;
        }
    }

    async deleteCurrency (currencyId) {
        try {
            return await this.Database.transaction(
                async (transaction) => {
                    await this.Database.query(
                        'DELETE FROM currency_quote WHERE code_id = $1',
                        [ currencyId ],
                        { transaction }
                    );

                    await this.Database.query(
                        'DELETE FROM currency WHERE id = $1',
                        [ currencyId ],
                        { transaction }
                    );
                }
            );
        } catch (err) {
            throw err;
        }
    }
};