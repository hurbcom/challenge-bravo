# Conversor de moedas

Uma API com objetivo de realizar a conversão entre diferentes moedas e utilizando como moeda de lastro (USD)

**As cotações são tiradas das seguintes APIs:**
 - USD_BRL = http://api.fixer.io/latest?base=USD
 - USD_EUR = http://api.fixer.io/latest?base=USD
 - USD_ETH = https://cex.io/api/last_price/ETH/USD
 - USD_BTC = https://cex.io/api/last_price/BTC/USD

**É apenas possível realizar a conversão entre as seguintes moedas:**
- USD
- BRL
- EUR
- BTC
- ETH

## API Endpoints
GET /api/conversion?from=USD&to=BRL&amount=1

### Parametros
- from = Moeda de origem
- to = Moeda que deseja converter
- amount = Valor a ser convertido

```
{
    "data": {
        "amount": 1,
        "converted_amount": 3.2508,
        "from": {
            "coin": "USD",
            "quote": 3.2508
        },
        "to": {
            "coin": "BRL",
            "quote": 0.3076
        }
    }
}
```

## Requisitos
 - Docker
 - Docker Compose

## Desenvolvimento

### Instalação
```
git clone https://github.com/gusttavoaguiarr/challenge-bravo challenge-bravo
cd challenge-bravo
```

### Executa a Aplicação
```
docker-compose up
```

Acesso: http://localhost:5000/api/conversion?from=USD&to=BRL&amount=1

### Executa o Flake8
```
make docker-flake8
```

### Executa todos os testes
```
make docker-test-all
```

### Executa os testes unitários
```
make docker-test-unit
```

### Executa os testes de integração
```
make docker-test-integration
```

### Executa a cobertura de testes
```
make docker-coverage
```
