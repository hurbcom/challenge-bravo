import pytest
from challengebravo.db.db import get_db
from challengebravo.db.currency_dao import Currency, retrieveCurrency, retrieveValue



@pytest.mark.parametrize('symbol, usd_value', [('ADA', 0.34131440176118233), ('XRP', 0.8058215514298602), ('doge', 3.434655675768504)])
def test_create(client, app, symbol, usd_value):
    response = client.put('/exchangePrice/createCurrency', json={'symbol': symbol, 'usd_value': usd_value})
    assert response.status_code == 200

    with app.app_context():
        assert retrieveCurrency(symbol.upper()) is not None


@pytest.mark.parametrize('symbol, usd_value', [('WLUNA', 0.03069838833461243), ('aed', 3.6732), ('ANG', 1.790838)])
def test_create_delete(client, app, symbol, usd_value):
    with app.app_context():
        response = client.put('/exchangePrice/createCurrency', json={'symbol': symbol, 'usd_value': usd_value})
        assert response.status_code == 200
        assert retrieveCurrency(symbol.upper()) is not None
        response = client.delete('exchangePrice/deleteCurrency', json={'symbol': symbol})
        assert response.status_code == 200
        assert retrieveCurrency(symbol.upper()) is None


@pytest.mark.parametrize('symbol_currency_from, symbol_currency_to, amount', [('BRL', 'BTC', '10'),('EUR', 'BRL', '3'),('ETH', 'USD', '8')])
def test_convert_currency(client, app, symbol_currency_from, symbol_currency_to, amount):
    response = client.get('exchangePrice/convertCurrency?from={currency_from}&to={currency_to}&amount={amount}'.format(currency_from = symbol_currency_from, currency_to = symbol_currency_to, amount = amount))
    assert response.status_code == 200
    with app.app_context():
        obj_currency_from = retrieveCurrency(symbol_currency_from)
        obj_currency_to = retrieveCurrency(symbol_currency_to)
        print(obj_currency_from.usd_value)
        print(obj_currency_to.usd_value)
        print(amount)
        if symbol_currency_to.upper() == "USD":
            converted_value = obj_currency_from.usd_value * float(amount);
        else:
            converted_value = obj_currency_to.usd_value / obj_currency_from.usd_value * float(amount)
        json_data = response.get_json()
        assert '{:.8f}'.format(converted_value) == json_data['convertedValue']



