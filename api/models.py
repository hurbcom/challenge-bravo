from api.app import Redis, OpenExchangeApi, cache

CURRENCIES_KEY = 'currencies'
ONE_HOUR = 3600


class Currency(object):
    currency_id = None
    rate = None

    def __init__(self, currency_id, rate):
        super(Currency, self).__init__()
        self.currency_id = currency_id
        self.rate = float(rate)

    def to_dict(self):
        return {
            'id': self.currency_id,
            'rate': self.rate
        }

    def save(self):
        return Redis.hset(CURRENCIES_KEY, self.currency_id, 1)

    def delete(self):
        return Redis.hdel(CURRENCIES_KEY, self.currency_id)


class Currencies(object):
    @classmethod
    def all(cls):
        currencies = Redis.hkeys(CURRENCIES_KEY)
        results = []

        for currency_id in currencies:
            currency = cls.get(currency_id)

            if currency:
                results.append(currency)

        return results

    @classmethod
    @cache.memoize(ONE_HOUR)
    def get(cls, currency_id):
        currency = Redis.hget(CURRENCIES_KEY, currency_id)

        if not currency:
            return None

        rate = OpenExchangeApi.get_currency_rate(currency_id)

        if not rate:
            return None

        return Currency(currency_id, rate)

    @classmethod
    def create(cls, currency_id):
        created = False
        currency = cls.get(currency_id)

        if not currency:
            rate = OpenExchangeApi.get_currency_rate(currency_id)

            currency = Currency(currency_id, rate)
            created = currency.save()

        return created, currency

    def __repr__(self):
        return 'Currencies'