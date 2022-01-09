from dao.currencydao import CurrencyDao

from exceptions.apiexceptions import InvalidCurrenciesException

class ConversionService():
    def getCurrecyValueFromTo(from_currency,to_currency,amount):
        try:
            if(from_currency not in sharedServer.server.cache and
            to_currency not in sharedServer.server.cache):
                exchange_value = CurrencyDao.getExchangeValue(to_currency,from_currency)
            else:
                if(from_currency in sharedServer.server.cache):
                    value_from = sharedServer.server.cache[from_currency]
                else:
                    value_from = CurrencyDao.get(from_currency).value

                if(to_currency in sharedServer.server.cache):
                    value_to = sharedServer.server.cache[to_currency ]
                else:
                    value_to = CurrencyDao.get(to_currency).value

                exchange_value = value_from/value_to

            return amount*exchange_value
        except Exception as e:
            raise InvalidCurrenciesException()
