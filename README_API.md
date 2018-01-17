## 1. Anotações do desenvolvedor:

- Pessoal, primeiramente me desculpem, sei que no [Readme.md](https://github.com/HotelUrbano/challenge-bravo/blob/master/README.md) do desafio vocês citam as tecnologias que tem mais afinidade, porém, optei por utilizar o Asp.Net C# por ser a tecnolgia que tenho maior nível de conhcimento atualmente;
- A API do projeto está consumindo com sucesso os dados da API externa e realizando a conversão de todas as moedas;
- A API externa utilizada é a [Coin Market Cap](https://coinmarketcap.com/api/);
- Como a API externa não oferecia o resultado das conversões de moedas, tive que implementar toda a lógica com base nas informações disponibilizadas por esta API. Este ponto do projeto demandou bastante tempo até que a lógica de conversão fosse finalizada.
- Não foi pedido, mas achei interessante retornar a informação 'data de última atualização das cotações' para que o usuário tenha uma idéia de valor/tempo na hora de analisar as cotações.

## 2. Formato para requisições via API do Projeto:

- ```/api/currencyConversion/getCurrenciesQuotation/{currencySymbol}```
- ```/api/convert/from/{fromCurrency}/to/{toCurrency}/amount/{amount:decimal}/```

## 3. Retornos da API:

 - Método de conversão de moedas na API (disponível na camada de controllers): 
    ```csharp
    public async Task<HttpResponseMessage> Convert([FromUri] string fromCurrency, string toCurrency, decimal amount){ ... }
    ```
    
 - Retorno do método de conversão de moedas (em formato json):    
    ```json
    {
        "From_Currency": "USD",
        "To_Currency": "BRL",
        "Orinigal_Value": 4580.25,
        "Converted_Value": 14731.02,
        "Quotation_Last_Update": "16/01/2018 07:34:23"
    }
    ```
    
## 4. Um pouco mais sobre o que foi utilizado na arquitetura do projeto (no lado da API):
    
- **Simple Injector** (Para aplicar o conceito de Injeção de Dependência);
- Utilização do **pattern Facade** (Na camada Business);
- **NLog** (Lib para captura/armazenamento de logs durante o runtime da aplicação);
- Utilização do conceito de **URLs amigáveis** (Conforme mostrado no item 2 deste documento);
- **Métodos assíncronos** (Utilizando async/await);
- **AutoMapper** (Lib para mapeamento entre objetos, tornando mais prática a manipulação dos mesmos);
