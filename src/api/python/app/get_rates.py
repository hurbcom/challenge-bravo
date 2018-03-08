from flask import current_app

class Get_rates:

    def __init__(self, from_cur, to_cur):
        self.from_cur = from_cur
        self.to_cur = to_cur

    def get(self):
        rate = current_app.redis.get("%s%s" % (self.from_cur, self.to_cur))
        if rate is None:
            rate = self.get_reverse()
        return float(rate)

    def get_reverse(self):
        rate_reverse = current_app.redis.get("%s%s" % (self.to_cur, self.to_cur))
        if rate_reverse is None:
            return 0
        return 1/rate_reverse
