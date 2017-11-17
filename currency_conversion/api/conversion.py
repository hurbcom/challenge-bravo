from currency_conversion.api.quote import Quote


class Conversion:

    def __init__(self, from_currency, to_currency, amount):
        self.ballast = 'USD'
        self.from_currency = from_currency
        self.from_quote = Quote(from_currency, to_currency).get()
        self.to_quote = Quote(to_currency, from_currency).get()
        self.amount = amount

    def get(self):
        value = float("{0:4.4f}".format(self.amount * self.from_quote))
        return value

    @property
    def get_from_quote(self):
        return self.from_quote

    @property
    def get_to_quote(self):
        return self.to_quote
