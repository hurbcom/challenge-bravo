import cryptocompare
from server.config import Config

class CurrencyIntegration():
    def getCurrencyInMainCurrency(currency_from):
        currency = cryptocompare.get_price(currency_from,Config.MAIN_CURRENCY)
        return currency[currency_from][Config.MAIN_CURRENCY]


