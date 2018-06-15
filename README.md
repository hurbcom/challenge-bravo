# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

API em PHP, que responde JSON, para conversão monetária. Ela usa dólar americano como lastro (USD) e fazer conversões entre diferentes moedas com cotações de verdade e atuais.

A API suporta as seguintes moedas:
- USD
- BRL
- EUR
- BTC
- ETH


Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

A requisição recebe como parâmetros: A moeda de origem, o valor a ser convertido e a moeda final.

Ex: `?from=BTC&to=EUR&amount=123.45`
