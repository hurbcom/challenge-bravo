## 1. Anotações do desenvolvedor:

- API local Consumindo dados da API externa;
- A API externa utilizada é a [Coin Market Cap](https://coinmarketcap.com/api/);
- API do projeto está realizando a conversão de todas as moedas;

## 2. Formato para requisições via API local:
- ```/api/currencyConversion/getCurrenciesQuotation/{currencySymbol}```
- ```/api/convert/from/{fromCurrency}/to/{toCurrency}/amount/{amount:decimal}/```

## 3. Retornos da API:
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
## 4. Um pouco mais sobre o que foi utilizado na arquitetura do projeto (API side):
- Simple Injector (Para aplicar o conceito de Injeção de Dependência);
- Utilização do pattern Facade (Na camada Business);
- NLog (Framework para captura de logs no runtime da aplicação e armazenamento dos mesmos em arquivo txt);
- Utilização do conceito de URLs amigáveis (Conforme mostrado no item 2 deste documento);
