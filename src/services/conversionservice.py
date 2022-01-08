from dao.currencydao import CurrencyDao

from exceptions.apiexceptions import InvalidCurrenciesException

class ConversionService():
    def getCurrecyValueFromTo(from_currency,to_currency,amount):
        try:
            exchange_value = CurrencyDao.getExchangeValue(to_currency,from_currency)
            return amount*exchange_value
        except:
            raise InvalidCurrenciesException()
