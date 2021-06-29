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

    _countValuesFromList (list) {
        return list.reduce((acc, value, index) => acc += `$${++index},`, "").slice(0, -1);
    }

    async listCurrenciesQuoteByCode (...codes) {
        try {
            const valuesCount = this._countValuesFromList(codes);
            const currencies = await this.Database.query(`SELECT c.id, c.code, cq.quote_value FROM currency c LEFT JOIN currency_quote cq ON c.id = cq.currency_id WHERE c.code in (${valuesCount})`, [ ...codes ]);
            
            return currencies.map(currency => this.CurrencyMapper.toDTO(currency));
        } catch (err) {
            throw err;
        }
    }

    async listBackingCurrency () {
        try {
            const backingCurrency = await this.Database.query('SELECT c.code FROM currency c LEFT JOIN backing_currency bc ON c.id = bc.currency_id');
            
            return this.CurrencyMapper.toDTO(backingCurrency[0]);
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