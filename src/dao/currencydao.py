from models.currencymodel import Currency

mocked_coins = { 'USD' : { 'BRL' : 1} }

class CurrencyDao():
    def getExchangeValueMocked(to_currency,from_currency):
        return mocked_coins[to_currency][from_currency]

    def getCurrency(name):
        return Currency.get(name)

    def getExchangeValue(to_currency,from_currency):
        to_currency_model = Currency.get(to_currency)
        from_currency_model = Currency.get(from_currency)
        exchange_value = from_currency_model.value/to_currency_model.value
        return exchange_value

    def getPopularCoins(num_coins):
        return Currency.getPopularCoins(num_coins)

    def saveOrUpdateCurrency(name,value):
        if Currency.exists(name):
            Currency.update(name,value)
        else:
            currency = Currency(name,value)
            currency.save()

    def saveOrUpdateCurrencyIntern(name,value):
        if Currency.exists(name):
            Currency.updateIntern(name,value)
        else:
            currency = Currency(name,value)
            currency.save()

    def removeCurrency(name):
        if Currency.exists(name):
            currency = Currency.get(name)
            currency.remove()

    def exists(name):
        return Currency.exists(name)

