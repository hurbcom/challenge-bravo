quotes = {
    'BRL': 3.2781,
    'EUR': 0.8576,
    'BTC': 0.00017,
    'ETH': 303.21
}

class Quote:

    def __init__(self, from_coin, to_coin):
        self.from_coin = from_coin
        self.to_coin = to_coin
        self.ballast = 'USD'

    def get(self):
        if self.to_coin == self.ballast:
            result = self.format_quote(self.convert_ballast_to())
        elif self.from_coin == self.ballast:
            result = self.format_quote(self.convert_ballast_from())
        else:
            result = self.format_quote(self.convert_from_to_quote())

        return self.from_to + ': ' + str(result)

    def convert_ballast_to(self):
        return 1 / quotes[self.from_coin]

    def convert_ballast_from(self):
        return quotes[self.to_coin]

    def convert_from_to_quote(self):
        return quotes[self.from_coin] / quotes[self.to_coin]

    def format_quote(self, quote):
        return float("{0:4.4f}".format(quote))

    @property
    def from_to(self):
        return self.from_coin + '_' + self.to_coin

