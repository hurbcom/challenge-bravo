# API Conversor de moedas

Este repositório possui o código-fonte da API que realiza conversão entre diferentes moedas, utilizando as respostas da API https://free.currencyconverterapi.com.

Para diminuir a latência da API, utilizo Redis para retornar as informações.

**Moedas utilizadas na conversão:**
- USD
- BRL
- EUR
- BTC
- ETH

## API Endpoints
GET /api/conversion?from=USD&to=BTC&amount=123

### Parametros
- from = Moeda de origem
- to = Moeda que deseja converter
- amount = Valor a ser convertido

```
{
    "from": "USD",
	"to": "BTC",
	"amount": "123",
	"converted_amount": "0,0015867",
}
```

## Requisitos
 - Docker
 - Docker Compose

## Desenvolvimento

### Instalação
```
git clone https://github.com/andrewbraga/challenge-bravo challenge-bravo
cd challenge-bravo
```

### Executa a Aplicação
```
docker-compose up
```

Acesso: http://localhost:8080/api/conversion?from=USD&to=BTC&amount=123

### Executa os testes unitários
```
make docker-test-unit
```