from dao.currencydao import CurrencyDao
from server.server import *
from exceptions.apiexceptions import InvalidCurrenciesException


class ConversionService():
    def getCache():
        return sharedServer.server.cache
    def currenciesExists(to_currency,from_currency):
        return (CurrencyDao.exists(to_currency) or
                CurrencyDao.exists(from_currency))
    def getCurrencyValueFromTo(to_currency,from_currency,amount):
        try:
            if (not ConversionService.currenciesExists(to_currency,from_currency)):
                raise InvalidCurrenciesException
            if(from_currency in ConversionService.getCache()):
                value_from = ConversionService.getCache()[from_currency]
            else:
                currency = CurrencyDao.getCurrency(from_currency)
                value_from = currency.value

            if(to_currency in ConversionService.getCache()):
                value_to = ConversionService.getCache()[to_currency ]
            else:
                currency = CurrencyDao.getCurrency(to_currency)
                value_to = currency.value

            exchange_value = value_from/value_to

            return amount*exchange_value
        except InvalidCurrenciesException as e:
            raise InvalidCurrenciesException()
