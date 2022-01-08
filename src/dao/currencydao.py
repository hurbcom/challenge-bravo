from models.currencymodel import Currency

mocked_coins = { 'USD' : { 'BRL' : 1} }

class CurrencyDao():
    def getExchangeValueMocked(to_currency,from_currency):
        return mocked_coins[to_currency][from_currency]

    def saveOrUpdateCurrency(name,value):
        if Currency.exists(name):
            Currency.update(name,value)
        else:
            currency = Currency(name,value)
            currency.save()
