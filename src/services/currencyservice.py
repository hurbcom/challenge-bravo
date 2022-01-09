from dao.currencydao import CurrencyDao
from models.currencyschema import *
from exceptions.apiexceptions import InvalidCurrenciesException, DatabaseException

class CurrencyService():
    def getCurrency(name):
        try:
            if name not in sharedServer.server.cache:
                currency = CurrencyDao.getCurrency(name)
                currency_json = currency_schema.dump(currency)
                currency_response = currency_json['value']
            else:
                currency_response = sharedServer.server.cache[name]
            return currency_response
        except:
            raise InvalidCurrenciesException()

    def saveCurrency(name,value):
        try:
            CurrencyDao.saveOrUpdateCurrency(name,value)
        except:
            raise DatabaseException()

    def removeCurrency(name):
        try:
            CurrencyDao.removeCurrency(name)
        except:
            raise DatabaseException()