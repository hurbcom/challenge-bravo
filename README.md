# Conversor de moedas

Uma API com objetivo de realizar a conversão entre diferentes moedas e utilizando como moeda de lastro (USD)

**As cotações são tiradas das seguintes APIs:**
 - USD_BRL_EUR = http://www.floatrates.com/daily/usd.json
 - ETH_BTC = https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BTC&tsyms=USD,BTC,ETH

**É apenas possível realizar a conversão entre as seguintes moedas:**
- USD
- BRL
- EUR
- BTC
- ETH

## API Endpoints
GET /api?from=BRL&to=USD&amount=1

### Parametros
- from = Moeda de origem
- to = Moeda que deseja converter
- amount = Valor a ser convertido

```
{ "data": { "from": BRL, "to": USD, "amount": 1, "converted_amount": 0.259928544888 } }
```

## Requisitos
 - Python
 - Flask==0.11.1
 - requests==2.19.1
 - apscheduler==3.5.2


## Desenvolvimento

### Instalação
```
git clone https://github.com/sl4ureano/challenge-bravo challenge-bravo
cd challenge-bravo
pip install -r requirements.txt
```

### Executa a Aplicação
```
python app.py
```

Acesso: http://localhost:5000/api?from=BRL&to=USD&amount=1
