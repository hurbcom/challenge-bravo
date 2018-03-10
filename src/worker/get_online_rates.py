import requests

class GetOnlineRates:
    def __init__(self):
        self.rates = []
        self.get_rates_from_coinmarketcap('EUR')
        self.get_rates_from_coinmarketcap('GBP')
        self.get_rates_from_coinmarketcap('BRL')
        self.get_rates_from_coinmarketcap('USD')
        self.get_rates_from_coinmarketcap('BTC')
        self.get_rates_from_coinmarketcap('ETH')
        self.get_rates_from_fixer('EUR')
        self.get_rates_from_fixer('GBP')
        self.get_rates_from_fixer('BRL')
        self.get_rates_from_fixer('USD')
        # self.get_rates_from_openexchange()
        # self.get_rates_from_apilayer()
    
    def get_all(self):
        return self.rates

    def get_rates_from_coinmarketcap(self, base_ex):
        # coinmarketcap - is free and unlimited
        try:
            resp = requests.get(
                'https://api.coinmarketcap.com/v1/ticker/?convert=%s' % base_ex
            )
            for quote in resp.json():
                self.rates.append([
                    '%s%s' % (base_ex, quote['symbol']), 
                    quote['price_%s' % base_ex.lower()]
                ])
        except Exception as e:
            print(dict(error_message=str(e)))

    def get_rates_from_fixer(self, base_ex):
        # fixer - is free and unlimited
        try:
            resp = requests.get(
                'https://api.fixer.io/latest?base=%s' % base_ex
            )
            for quote in resp.json()["rates"]:
                self.rates.append([
                    '%s%s' % (base_ex, quote), 
                    resp.json()["rates"][quote]
                ])
        except Exception as e:
            print(dict(error_message=str(e)))
    
    def get_rates_from_openexchange(self, base_ex = 'USD'):
        # openexchange - is free until 1k per month
        try:
            resp = requests.get(
                'https://openexchangerates.org/api/latest.json?app_id=f2e995cf853e4945b208b96a65d217d7&base=%s' % base_ex
            )
            for quote in resp.json()["rates"]:
                self.rates.append([
                    '%s%s' % (base_ex, quote),
                    resp.json()["rates"][quote]
                ])
        except Exception as e:
            print(dict(error_message=str(e))) 
    
    def get_rates_from_apilayer(self, base_ex = 'USD'):
        # currencylayer - is free until 1k total requests and only for USD base
        try:
            resp = requests.get(
                'http://www.apilayer.net/api/live?access_key=9a29405877af2d37a0c949d8aa0583fc&format=1&source=%s' % base_ex
            )
            for quote in resp.json()["quotes"]:
                self.rates.append([
                    quote, 
                    resp.json()["quotes"][quote]
                ])
        except Exception as e:
            print(dict(error_message=str(e)))