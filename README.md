# Conversão de moedas

API que converte moedas usando como fonte o Open Exchange Rates, usando sempre uma moeda como lastro (por padrão, USD).

O cadastro gratuito no Open Exchange Rates atualiza as cotações das moedas a cada hora fechada (0h a.m., 1h a.m., 2h a.m., etc), então esse projeto atualiza suas informações com o OpenExchangeRates sempre que o projeto é iniciado e sempre 5 minutos após a hora fechada (00:05 a.m., 01:05 a.m., 02:05 a.m., etc) 

## Executando

Para rodar o projeto, você pode usar o Dockerfile contido aqui, ou:

```bash
cp sample.env .env
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

```

## Exemplo de uso

Existem dois principais usos para a API:

### Visualizar informações sobre uma moeda

Para visualizar informações sobre uma moeda específica, deve-se acessar o endpoint `/api/currencies/<symbol>`, por exemplo:

http://localhost:8000/api/currencies/USD irá retornar:
```json
{
    "symbol": "USD",
    "is_base": true,
    "value": "1.000000000000",
    "last_updated": "2019-01-01T00:00:00Z"
}
```
Já que USD é a moeda de lastro, ela recebe `is_base=True` e tem `value=1`

### Ver conversões entre moedas

Para fazer uma conversão, basta acessar o endpoint `/api/currencies/<symbol>/<amount>/to/<destiny_symbol>`, por exemplo, para converter 10 BTC para BRL:

http://127.0.0.1:8000/api/currencies/BTC/10/to/BRL/ irá retornar:
```json
{
    "value": "355700.4350080097021043743600",
}
```

## Testes

Para executar a suíte de testes, após instalar as dependẽncias, basta executar:

```bash
python manage.py test
```

## Boilerplate

Conforme pedido a ser especificado, os boilerplates nesse projeto são a maior parte do `currencies/settings.py` e a migração 0001 da app core (`core/migrations/0001_initial.py`)
