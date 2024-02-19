import redis


r = redis.Redis(host='localhost', port=6379, db=7, decode_responses=True)

class Redis():
    def add_currency(self, currency: dict):
        if currency.get("is_fictional", False):
            mounted_currency = {
                "currency_name": currency["currency_name"].upper(),
                "backing": currency["backing"].upper(),
                "backing_amount": currency["backing_amount"],
            }

            r.hmset(currency["currency_name"].upper(), mounted_currency)

        currency_name_upper = currency["currency_name"].upper()
        r.rpush("available_currencies", currency_name_upper)
        return r.lrange("available_currencies", 0, -1)
    
    def update_currency(self, currency_name: str, currency: dict):
    
        r.hmset(currency_name, currency)

        return self.get_currency(currency_name)

    def get_currency(self, currency_name: str):

        return r.hgetall(currency_name)
