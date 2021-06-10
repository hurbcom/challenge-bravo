from challenge_bravo.exceptions.conversion_exceptions import MissingParameterError, UnableToFindCurrencyError


class Conversion:

    def __call__(self, container, **kwargs):
        self.origin_currency = kwargs.get('from', None)
        self.destiny_currency = kwargs.get('to', None)
        self.amount = kwargs.get('amount', None)
        self.mongo = container.get('mongodb')
        self.exchange_rate_api = container.get('exchange_rate_api')
        self.validate()
        return self

    def validate(self):
        if not self.amount:
            raise MissingParameterError('Amount should be provided')
        if not self.destiny_currency:
            raise MissingParameterError('Destiny Currency should be provided')
        if not self.origin_currency:
            raise MissingParameterError('Origin Currency should be provided')

    def convert(self):
        origin_currency_rate = self.get_currency_rate(self.origin_currency)
        destiny_currency_rate = self.get_currency_rate(self.destiny_currency)
        if origin_currency_rate and destiny_currency_rate:
            return origin_currency_rate / destiny_currency_rate * float(self.amount)
        raise UnableToFindCurrencyError('Unable to find currency')

    def get_currency_rate(self, currency):
        currency_rate = self.mongo.get_from_collection(code=currency)
        if currency_rate is None:
            currency_rate = self.exchange_rate_api.convert_currencies(currency).rate
        else:
            return currency_rate.get('currency_value_in_usd')
        return currency_rate
