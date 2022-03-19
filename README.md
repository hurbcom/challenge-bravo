# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Bravo Challenge
## Arquitetura
<p align="center">
  <img src="app-architecture.jpg" alt="arquitetura" />
</p>

## Endpoints

Retornar todas as Moedas:
<pre><code>curl -X 'GET' \
  'http://localhost:8080/api/Currencies' \
  -H 'accept: text/plain'
</code></pre>

Adicionar nova Moeda:
<pre><code>curl -X 'POST' \
  'http://localhost:8080/api/Currencies' \
  -H 'accept: text/plain' \
  -H 'Content-Type: application/json' \
  -d '{
  "symbol": "BRL",
  "name": "Real Brasileiro",
  "exchangeRateInUSD": 0.199,
  "autoUpdateExchangeRate": true,
  "lastTimeUpdatedExchangeRate": "2022-03-19T02:41:17.365Z"
}'

</code></pre>
Retornar Moeda específica:
<pre><code>curl -X 'GET' \
  'http://localhost:8080/api/Currencies/BRL' \
  -H 'accept: text/plain'
</code></pre>

Deletar Moeda específica:
<pre><code>curl -X 'DELETE' \
  'http://localhost:8080/api/Currencies/BRL' \
  -H 'accept: text/plain'
</code></pre>

Converter valor entre Moedas:
<pre><code>curl -X 'GET' \
  'http://localhost:8080/api/CurrenciesConvert?from=BRL&to=EUR&amount=42.10' \
  -H 'accept: text/plain'
</code></pre>

## Libs e Ferramentas
- Pomelo.EntityFrameworkCore.MySql
- xunit
- CacheManager.Core
- Swashbuckle.AspNetCore
- JMeter

## Testes

### Teste de Carga

### Testes unitários

## Execução

- `$ docker-compose up -d`
- Aguardar os containers subirem completamente, o BD leva mais tempo e o App só ficara disponível após o BD subir completamente.
- Acessar: http://localhost:8080/index.html

## Limitações e Possíveis Melhorias

- Delay da cotação
- Autenticação
- Checar moedas disponíveis para auto update

<p align="center">
  <img src="ca.jpg" alt="Challange accepted" />
</p>
