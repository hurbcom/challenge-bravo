export default class Currency {
    constructor (Database, CurrencyMapper, Cache) {
        this.Database = Database;
        this.CurrencyMapper = CurrencyMapper;
        this.Cache = Cache;
    }

    async listCurrencies () {
        try {
            const currenciesList = await this.Database.query('SELECT code FROM currency');

            return currenciesList.map(currency => this.CurrencyMapper.toDTO(currency));
        } catch (err) {
            throw err;
        }
    }

    listCurrencyByCode (currencyCode) {
        return this.Database.query('SELECT id, code FROM currency WHERE code = $1', [ currencyCode ]);
    }

    async _listCurrenciesQuoteByCode () {
        try {
            let dbCurrenciesQuote = this.Cache.get('dbCurrenciesQuote');

            if (dbCurrenciesQuote) return dbCurrenciesQuote;
            
            dbCurrenciesQuote = await this.Database.query('SELECT c.id, c.code, cq.quote_value FROM currency c LEFT JOIN currency_quote cq ON c.id = cq.currency_id LEFT JOIN backing_currency bc ON c.id = bc.currency_id WHERE bc.currency_id IS NULL');

            this.Cache.set({ dbCurrenciesQuote });

            return dbCurrenciesQuote;
        } catch (err) {
            throw err;
        }
    }

    async listCurrenciesWithQuoteByCode () {
        try {
            const currenciesList = await this._listCurrenciesQuoteByCode();
            
            return currenciesList.reduce((acc, currency) => {
                if (currency.quote_value) {
                    const mappedCurrency = this.CurrencyMapper.toDTO(currency);
                    
                    acc.push(mappedCurrency);
                }

                return acc;
            }, []);
        } catch (err) {
            throw err;
        }
    }

    async listCurrenciesWithoutQuoteByCode () {
        try {
            const currenciesList = await this._listCurrenciesQuoteByCode();
            
            return currenciesList.reduce((acc, currency) => {
                if (!currency.quote_value) {
                    const mappedCurrency = this.CurrencyMapper.toDTO(currency);
                    
                    acc.push(mappedCurrency);
                }

                return acc;
            }, []);
        } catch (err) {
            throw err;
        }
    }

    async listBackingCurrency () {
        try {
            const [ backingCurrency ] = await this.Database.query('SELECT c.code FROM currency c JOIN backing_currency bc ON c.id = bc.currency_id');
            
            return this.CurrencyMapper.toDTO(backingCurrency);
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
                        'DELETE FROM currency_quote WHERE currency_id = $1',
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