from contracts.currencyconversion.currencyconversionapi import CurrencyConversionApi

# Example class
class CurrencyConversionMockApi(metaclass=CurrencyConversionApi):
    # valid
    validCurrencies = ['USD', 'BTC']
    # invalid
    #validCurrencies = ['', None, [], (), {}, 0, lambda x: x]

    def __init__(self):
        print('hello from subclass')
