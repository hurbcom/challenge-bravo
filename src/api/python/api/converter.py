from api.get_rates import GetRates

class Converter:
    def __init__(self, from_cur, to_cur, amount):
        self.from_cur = from_cur
        self.to_cur = to_cur
        self.rate = GetRates(from_cur, to_cur).get()
        self.amount = amount
    
    def get(self):
        converted = float(self.rate * self.amount)
        return converted, self.rate
