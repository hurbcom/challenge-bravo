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

## Arquitetura
<p align="center">
  <img src="architecture.png" alt="Architecture" />
</p>

### Worker:
- Resposável por manter as cotações sempre atualizadas.
- Ele foi construído com um scheduler que a cada 30 minutos busca as cotações atualizadas em algumas fontes na internet e as salva no redis.
- Permite diminuir o tempo de resposta da API já que não irá precisar consultar a atualização na internet.

### Redis:
- Banco NoSql chave valor e in_memory, extremamente rápido.
- Possibilita cache de cotações para disponibilizar para a API.

### API:
- Responde aos requests http de converções dos usuários e processa as requisições entregando o resultado da cotação pocessada no formato **JSON**.

### NGIX:
- Realiza cache (com TTL) da resposta da API conforme a query_string assim, a API não precisará processar duas vezes a mesma requição no mesmo espaço de tempo.

## EXECUTANDO
```bash
  $> git clone https://github.com/maypimentel/challenge-bravo.git
  $> cd challenge-bravo
  $> ./run.sh
```
Ex: http://localhost:3333/api/?from=USD&to=EUR&amount=564.3

## Bônus
### SWAGGER
- Interface do SWAGGER para testes e documentação
```javascript
http://127.0.0.1:3333/swagger/
```
