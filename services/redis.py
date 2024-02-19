import redis


r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

class Redis():
    def add_currency(self, currency: dict):
        
        r.rpush("avaliable_currencies", currency["name"])
        if currency.get("is_fictional", False):
            mounted_currency = {
                "currency_name": currency["name"],
                "backing": currency["backing"],
                "backing_amount": currency["backing_amount"],
            }

            r.hmset(currency["name"], mounted_currency)

        return r.hgetall("avaliable_currencies")
    
    def update_currency(self, currency_name: str, currency: dict):
    
        r.hmset(currency_name, currency)

        return self.get_currency(currency_name)

    def get_currency(self, currency_name: str):

        return r.hgetall(currency_name)
