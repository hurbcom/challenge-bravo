from dao.conversiondao import ConversionDao

class ConversionService():
    def getCurrecyValueFromTo(from_currency,to_currency,amount):
        exchange_value = ConversionDao.getExchangeValue(to_currency,from_currency)
        return amount*exchange_value