# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Challenge Bravo - Conversão Monetária

![](https://media.giphy.com/media/67ThRZlYBvibtdF9JH/giphy.gif)


API construida com NodeJs para conversão monetária entre moedas

Moedas aceitas como parametro:
- BRL - Real 
- USD - Dollar
- EUR - Euro
- BTC - Bitcoin
- ETH - Ethereum



## Rodando o projeto
Após clonar o projeto rode o seguinte comando `docker-compose up`, este comando irá:

- instalar as dependencias
- rodar a suite de testes
- iniciar a aplicação

## Rodando o stress test na API
Com o servidor rodando, abra um terminal e rode o seguinte comando `npm run stress-test` para rodar o teste de estresse na API.

## Endpoints da API
A url para conversão é a `/api/v1/currency_quotes` aceitando como parametro:
- **From**: moeda de origem a ser convertida
- **to**: moeda para qual o valor será convertido
- **amount**: valor a ser convertido


### Exemplo

  - get `/api/v1/currency_quotes?from=USD&to=BRL&amount=135.30`.
  - get `/api/v1/currency_quotes?from=BRL&to=BRL&amount=123`.
 
**Response**:

```
{
  date: '2018-11-17',
  from: 'USD',
  to: 'BRL',
  amount: '123',
  converted: 200,
}
```



## Informações

- Foi utilizado no teste a API [CryptoCompare](https://min-api.cryptocompare.com) que fornece a cotação atualizada das moedas.
- Foi utlizado o express como framework junto ao node para criação da aplicação, mas a implementação das ` controllers, helpers, services, e configs` foram implementações genuinas sem frameworks, somente utilizando artificios da linguagem.


## Pontos de melhorias

- A utilização de um banco de cache como redis ou até mesmo um SQLite para guardar valores em caso de falha ou consulta repetida em um espaço de tempo de 24 horas, tirando a necessidade de requisitar a API [CryptoCompare](https://min-api.cryptocompare.com).

- Adicionar CI&CD como o [TravisCi](https://travis-ci.org/)
- Melhorar o helper que valida os parametros vindos da requisição, utilizando por exemplo um [Express-Validator](https://github.com/express-validator/express-validator).
