import pytest
from challengebravo import currency_dao
from challengebravo.db import get_db
from challengebravo.currency_dao import Currency, retrieveCurrencies, retrieveCurrency, retrieveValue, create


@pytest.mark.parametrize('symbol, usd_value', [('ada', 0.34131440176118233), ('xrp', 0.8058215514298602), ('doge', 3.434655675768504)])
def test_create_retrieve(app, symbol, usd_value):
    with app.app_context():
        currency_to_create = Currency(symbol, usd_value)
        assert retrieveCurrency(symbol.upper()) is None
        assert retrieveValue(currency_to_create) is None
        create(currency_to_create)
        assert retrieveCurrency(symbol.upper()) is not None
        assert retrieveValue(currency_to_create) is not None
        


def test_retrieve_currencies(app):
    with app.app_context():
        currencies_on_test_startup = ['USD', 'BRL', 'ETH', 'BTC', 'AUD', 'CAD', 'EUR']
        db_currencies = retrieveCurrencies()
        print(db_currencies)
        for i in db_currencies:
            if i in currencies_on_test_startup:
                currencies_on_test_startup.remove(i)
        assert bool(currencies_on_test_startup) is False