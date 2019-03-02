# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

Esta é uma API para conversão monetária que suporta as seguintes moedas:

- USD
- BRL
- EUR
- BTC
- ETH

É possível converter cada uma dessas moedas para qualquer outra moeda da lista.

Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

A requisição deve receber como parâmetros: A moeda de origem, o valor a ser convertido e a moeda final.

Ex: `http://localhost:5000/currency?from=BTC&to=EUR&amount=123.45`

O retorno segue o seguinte formato:

`{ "from": "BRL", "to": "USD", "amount": 1.00, "converted_amount": 0.26, "exchange_rate": 0.260000 }`

A linguagem utilizada para escrever o script foi o Python 2.7.

A API do CryptoCompare foi utilizada para a obtenção das taxas de câmbio atualizadas.
Tal API poder ser acessada através do link: https://www.cryptocompare.com/

As taxas de conversão são armazenadas em um arquivo de banco de dados sqlite3 de modo que se uma mesma consulta é repetida dentro de 1 hora, não é necessário consultar a API do CryptoCompare.

## Instalação

1. Instalar Python 2.7 e pip: `sudo apt install python2.7 python-pip`
2. Instalar Flask: `pip install Flask`

## Execução

1. Rodar a aplicação: `python app.py`
2. Acessar a url `http://localhost:5000/currency?from=FROM_CURRENCY&to=TO_CURRENCY&amount=AMOUNT`, onde FROM_CURRENCY é a moeda de origem, TO_CURRENCY é a moeda de destino e AMOUNT é um valor na moeda de origem a ser convertido para a moeda de destino (é necessário estar logado no site do CryptoCompare).
3. Para executar os testes: `python -m unittest test_app`