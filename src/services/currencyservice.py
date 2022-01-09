from dao.currencydao import CurrencyDao
from models.currencyschema import *
from exceptions.apiexceptions import InvalidCurrenciesException, DatabaseException

class CurrencyService():
    def getCurrency(name):
        try:
            currency = CurrencyDao.getCurrency(name)
            return currency_schema.dump(currency)
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