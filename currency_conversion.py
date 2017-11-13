cotacoes = {
    'BRL': 3.2781,
    'EUR': 0.8576,
    'BTC': 0.00017,
    'ETH': 303.21
}

class CurrencyConversion:

    def __init__(self, from_currency, to_currency, amount):
        self.ballast = 'USD'
        self.from_currency = from_currency
        self.to_currency = to_currency
        self.amount = amount

    def currency_from(self):
        return cotacoes[ self.from_currency ]

    def currency_to(self, coin):
        return cotacoes[ coin ]

    def conversion(self):
        if self.ballast == self.from_currency :
            value = self.usd_to(self.to_currency)
        elif self.ballast == self.to_currency:
            value = self.coin_to_usd(self.from_currency)
        else:
            value = self.coin_to_coin(self.to_currency)

        return value

    def usd_to(self, coin):
        return float("{0:4.4f}".format(self.amount * self.currency_to(coin)))

    def coin_to_usd(self, coin):
        return float("{0:4.4f}".format(self.amount / self.currency_to(coin)))

    def coin_to_coin(self, coin):
        value = self.currency_from() / self.currency_to(coin)
        return float("{0:4.4f}".format(value * self.amount))
