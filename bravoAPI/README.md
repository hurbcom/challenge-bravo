## API Bravo

Esta API desenvolvida em Python tem como objetivo fazer a conversão das seguintes moedas:
- BRL - Real
- USD - Dollar
- EUR - Euro
- BTC - Bitcoin
- ETH - Ethereum

### Seu processo está estrutudado da seguinte maneira:

![Diagrama de Processo](static/images/DiagramaB.png)

****
### Arquivo de configuração
```python
DEBUG           = False
PORT            = 5000
# moedas disponíveis para conversão
COINS_AVAILABLE = ['USD','BRL', 'EUR', 'BTC', 'ETH']
# credenciais de acesso ao banco
USER        = ""
PASS        = ""
ADRESS      = "ds131676.mlab.com"
PORT        = "31676"
DATABASE    = "hurb"
COLLECTON   = "cotation"
```
***
### Informações

Com o objetivo de facilitar o lado dos avaliadores, a API está hospedada na plataforma do [heroku](https://www.heroku.com/). 
Para de certificar que a url esta de pé, basta acessar. 
```
https://challengerhurb.herokuapp.com/
```
***
### Endpoints

A url para a conversão é ```api/v1/bravo``` e seus parâmetros obrigatórios de entrada são:
- from : Moeda de origem a ser convertida
- to: Moeda de destino a ser convertida
- amount: Quantidade desejada a ser convertida

***Exemplo de uso***
- get ```https://challengerhurb.herokuapp.com/api/v1/bravo?from=USD&to=EUR&amount=2000```
- get ```https://challengerhurb.herokuapp.com/api/v1/bravo?from=BRL&to=USD&amount=73.9```

***Exemplo de resposta***

```json
{
    "Amount": "73.9",
    "Converted": 18.76,
    "From": "BRL",
    "To": "USD",
    "Updated At": "2019-04-11 01:49:21",
}
```
