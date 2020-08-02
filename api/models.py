from api.app import redisConnector

CURRENCIES_KEY = 'currencies'


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
        return redisConnector.hset(CURRENCIES_KEY, self.currency_id, self.rate)

    def delete(self):
        return redisConnector.hdel(CURRENCIES_KEY, self.currency_id)


class Currencies(object):
    @classmethod
    def all(cls):
        currencies = redisConnector.hgetall(CURRENCIES_KEY)
        results = []

        for currency in currencies.items():
            results.append(Currency(*currency))

        return results

    @classmethod
    def get(cls, currency_id):
        rate = redisConnector.hget(CURRENCIES_KEY, currency_id)

        if not rate:
            return None

        return Currency(currency_id, rate)

    @classmethod
    def create(cls, currency_id, rate):
        created = False
        currency = cls.get(currency_id)

        if not currency:
            currency = Currency(currency_id, rate)
            created = currency.save()

        return created, currency