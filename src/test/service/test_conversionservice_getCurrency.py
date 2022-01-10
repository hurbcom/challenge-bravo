import unittest
from unittest.mock import Mock

from models.currencymodel import *
from services.conversionservice import *
from exceptions.apiexceptions import *
from server.server import server

class TestConversionServiceGetCurrency(unittest.TestCase):
    def setUp(self):
        self.client = sharedServer.server.test_client()

    def test_when_currency_doesnt_exists(self):
        #arrange
        ConversionService.currenciesExists = Mock(return_value=False)
        #act
        exception_raised = False
        try:
            result = ConversionService.getCurrencyValueFromTo('erro','erro',1)
            assert result is InvalidCurrenciesException
        except:
            exception_raised = True

        #assert
        assert exception_raised == True

    def test_when_currencies_are_cached(self):
        #arrange
        from_currency = 'HURB'
        from_currency_value = 2
        to_currency = 'BTC'
        to_currency_value = 2
        amount = 1
        expected_result = (from_currency_value/to_currency_value)*amount
        ConversionService.currenciesExists = Mock(return_value=True)
        cache = {from_currency:from_currency_value,to_currency:to_currency_value}
        ConversionService.getCache = Mock(return_value=cache)
        CurrencyDao.getCurrency = Mock(return_value=Currency(from_currency,from_currency_value))
        #act
        result = ConversionService.getCurrencyValueFromTo(to_currency,from_currency,amount)
        #assert
        assert result == expected_result

    def test_when_currencies_are_in_db(self):
        #arrange
        from_currency = 'HURB'
        from_currency_value = 2
        to_currency = 'BTC'
        to_currency_value = 2
        amount = 1
        expected_result = (from_currency_value/to_currency_value)*amount
        ConversionService.currenciesExists = Mock(return_value=True)
        ConversionService.getCache = Mock(return_value={})
        CurrencyDao.getCurrency = Mock(return_value=Currency(from_currency,from_currency_value))
        #act
        result = ConversionService.getCurrencyValueFromTo(to_currency,from_currency,amount)
        #assert
        assert result == expected_result

if __name__ == '__main__':
    unittest.main()
