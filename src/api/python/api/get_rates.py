from api import db

class GetRates:

    def __init__(self, from_cur, to_cur):
        self.from_cur = from_cur
        self.to_cur = to_cur
        self.ballast_cur = "USD"

    def get(self):
        if self.from_cur == self.to_cur:
            rate = 1
        else:
            rate = db.get("%s%s" % (self.from_cur, self.to_cur))
            if rate is None:
                rate = self.get_reverse()

        return float(rate)

    def get_reverse(self):
        rate_reverse = db.get("%s%s" % (self.to_cur, self.from_cur))
        if rate_reverse is None:
            return self.get_rates_from_ballast()
        return 1/float(rate_reverse)

    def get_rates_from_ballast(self):
        ballast_from_rate = db.get("%s%s" % (self.ballast_cur, self.from_cur))
        ballast_to_rate = db.get("%s%s" % (self.ballast_cur, self.to_cur))
        if ((ballast_from_rate is None) or (ballast_to_rate is None)):
            return 0
        else:
            rate_from_ballast = float(ballast_from_rate) / float(ballast_to_rate)
            db.set("%s%s" % (self.from_cur, self.to_cur), rate_from_ballast, 900)
            return rate_from_ballast
