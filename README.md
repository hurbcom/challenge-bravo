# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

Construa uma API, que responda JSON, para conversão monetária. Ela deve ter uma moeda de lastro (USD) e fazer conversões entre diferentes moedas com cotações de verdade e atuais.

A API deve converter entre as seguintes moedas:
- USD
- BRL
- EUR
- BTC
- ETH


Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

A requisição deve receber como parâmetros: A moeda de origem, o valor a ser convertido e a moeda final.

Ex: `?from=BTC&to=EUR&amount=123.45`

# Sobre o desafio

O desafio foi desenvolvido em NodeJS com Express. Testes unitarios foram feitos usando Mocha, Chai e Sinon. O arquivo bin/www foi autogerado, assim como grande parte do app.js.

A API sobe por padrao em localhost:5000. Consulta a API CryptoCompare versão free para obter os valores de conversao atualizados. Para um teste de carga com 1000 requisições por segundo, é necessário mudar para um plano pago.
Esta API foi escolhida pois possui todas as moedas necessárias, é atualizada frequentemente e tem o plano gratuito com maior quantidade de requests.



# Como executar:

Instalar NodeJS e NPM. Exemplo no Ubuntu: 'sudo apt-get install -y nodejs npm'. 
Instalar dependencias usando: (a partir da pasta clonada)
    'cd api'
    'npm install'

Executar o projeto com 'node app.js'.
