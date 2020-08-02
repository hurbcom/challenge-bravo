from api.app import redisConnector
from api.open_exchange import OpenExchange

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
        return redisConnector.hset(CURRENCIES_KEY, self.currency_id, 1)

    def delete(self):
        return redisConnector.hdel(CURRENCIES_KEY, self.currency_id)


class Currencies(object):
    @classmethod
    def all(cls):
        currencies = redisConnector.hkeys(CURRENCIES_KEY)
        results = []

        open_exchange = OpenExchange('9e99dd7952614fb494bc2fa538c7a7c4')

        for currency_id in currencies:
            rate = open_exchange.get_currency_rate(currency_id)

            if rate:
                results.append(Currency(currency_id, rate))

        return results

    @classmethod
    def get(cls, currency_id):
        currency = redisConnector.hget(CURRENCIES_KEY, currency_id)

        if not currency:
            return None

        open_exchange = OpenExchange('9e99dd7952614fb494bc2fa538c7a7c4')
        rate = open_exchange.get_currency_rate(currency_id)

        if not rate:
            return None

        return Currency(currency_id, rate)

    @classmethod
    def create(cls, currency_id):
        created = False
        currency = cls.get(currency_id)

        if not currency:
            open_exchange = OpenExchange('9e99dd7952614fb494bc2fa538c7a7c4')
            rate = open_exchange.get_currency_rate(currency_id)

            currency = Currency(currency_id, rate)
            created = currency.save()

        return created, currency