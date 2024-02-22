import redis


r = redis.Redis(host='localhost', port=6379, db=7, decode_responses=True)

class Redis():
    def add_currency(self, currency: dict):
        if currency.get("is_fictional", False):
            mounted_currency = {
                "currency_name": currency["currency_name"].upper(),
                "is_fictional": "True",
                "backing": currency["backing"].upper(),
                "backing_amount": currency["backing_amount"],
            }

            r.hmset(currency["currency_name"].upper(), mounted_currency)

        currency_name_upper = currency["currency_name"].upper()
        r.rpush("available_currencies", currency_name_upper)
        return r.lrange("available_currencies", 0, -1)
    
    def update_currency(self, currency: dict):
        currency_name = currency.get("currency_name")
        is_fictional = "True" if currency.get("is_fictional") else "False"
        mounted_currency = {
                "currency_name": currency["currency_name"].upper(),
                "is_fictional": is_fictional,
                "backing": currency["backing"].upper(),
                "backing_amount": currency["backing_amount"],
            }
        r.hmset(currency_name.upper(), mounted_currency)


        return self.get_currency(currency_name)

    def get_currency(self, currency_name: str):

        return r.hgetall(currency_name)
    
    def get_avaliable_currencies(self):

        return r.lrange("available_currencies", 0, -1)
    
    def remove_currency_from_list(self, currency_name: str):
        r.lrem("available_currencies", 0, currency_name.upper())

        return r.lrange("available_currencies", 0, -1)
