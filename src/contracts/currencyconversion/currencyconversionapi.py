import types

class CurrencyConversionApi(type):
    def __new__(cls, name, bases, attr):

        # Check upon existence of a string list called 'validCurrencies' for the integration subclass
        # Verifies if there are any None or '' or non-str types
        if not 'validCurrencies' in attr \
                or not isinstance(attr['validCurrencies'], list) \
                or len(attr['validCurrencies']) == 0 \
                or len(list(filter(lambda objType: not isinstance(objType, str) or not objType, attr['validCurrencies']))) > 0:

            raise NotImplementedError(
                'Subclass {name} must have a list of (non-empty) strings called ''validCurrencies'' containing all possible currency conversion arguments'
                .format(name=name))
        
        if not 'convert' in attr \
                or not (attr['convert'], types.MethodType):
                # using inspect, get the arguments to test its signature too

            raise NotImplementedError(
                'Subclass {name} must implement a ''convert(conversionRequest)'' method receiving the correct parameter'
                .format(name=name))

        return super(CurrencyConversionApi, cls).__new__(cls, name, bases, attr)

# Example class
# class Test(metaclass=CurrencyConversionApi):
#     # valid
#     validCurrencies = ['USD', 'BTC']
#     # invalid
#     #validCurrencies = ['', None, [], (), {}, 0, lambda x: x]

#     def __init__(self):
#         print('hello from subclass')

# t = Test()
