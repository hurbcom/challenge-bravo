## Anotações do desenvolvedor:

- API local Consumindo dados da API externa;
- API local está realizando a conversão de USD para qualquer moeda (USD, BRL, EUR, BTC e ETH);
- Formato para requisições via API local 
    - /api/currencyConversion/getCurrenciesQuotation/{currencySymbol}
    - /api/convert/from/{fromCurrency}/to/{toCurrency}/amount/{amount:decimal}/

## Retornos da API:
 - Quando solicitado o método de conversão da moeda **GetCurrencyConverted(string fromCurrencySymbol, string toCurrencySymbol, decimal amount)**:
    ```json
    {
        "From_Currency": "USD",
        "To_Currency": "BRL",
        "Orinigal_Value": 4580.25,
        "Converted_Value": 14731.02,
        "Quotation_Last_Update": "16/01/2018 07:34:23"
    }
    ```
