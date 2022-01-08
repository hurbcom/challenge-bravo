class ConvertRequestModel():
    def __init__(self,to,from_currency,amount):
        self.to_currency= to
        self.from_currency = from_currency
        self.amount = amount

    def isDataNull(self,):
        return (self.to_currency == None or
                self.from_currency == None or
                self.amount == None)

class CurrencyGetRequestModel():
    def __init__(self,name):
        self.name = name

    def isDataNull(self):
        return (self.name == None)


