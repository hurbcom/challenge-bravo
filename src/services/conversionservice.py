from dao.currencydao import CurrencyDao

class ConversionService():
    def getCurrecyValueFromTo(from_currency,to_currency,amount):
        exchange_value = CurrencyDao.getExchangeValueMocked(to_currency,from_currency)
        return amount*exchange_value