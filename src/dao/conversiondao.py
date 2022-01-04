mocked_coins = { 'USD' : { 'BTC' : 5, 'BRL' : 6, 'EUR' : 4, 'ETH' : 0.4, 'USD' : 1},
                 'BRL' : { 'USD' : 5, 'BTC' : 6, 'EUR' : 4, 'ETH' : 0.4, 'BRL' : 1},
                 'EUR' : { 'USD' : 5, 'BRL' : 6, 'BTC' : 4, 'ETH' : 0.4, 'EUR' : 1},
                 'ETH' : { 'USD' : 5, 'BRL' : 6, 'EUR' : 4, 'BTC' : 0.4, 'ETH' : 1},
                 'BTC' : { 'USD' : 5, 'BRL' : 6, 'EUR' : 4, 'ETH' : 0.4, 'BTC' : 1}}

class ConversionDao():
    def getCurrecyValueFrom(to_currency,from_currency):
        return mocked_coins[to_currency][from_currency]
