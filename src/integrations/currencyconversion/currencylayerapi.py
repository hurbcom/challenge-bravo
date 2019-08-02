from contracts.currencyconversion.currencyconversionapi import CurrencyConversionApi

# Example class
class CurrencyLayerApi(metaclass=CurrencyConversionApi):
    # valid
    validCurrencies = ['USD']
    # invalid
    #validCurrencies = ['', None, [], (), {}, 0, lambda x: x]

    def __init__(self):
        print('hello from subclass')

t = CurrencyLayerApi()
