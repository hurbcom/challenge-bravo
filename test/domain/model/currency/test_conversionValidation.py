import unittest

from src.domain.model.currency.conversion import Conversion

# Test from the repo main with: "python3 -m pytest"

class CurrencyValidationTests(unittest.TestCase):

    validCurrencies = ['USD','BRL', 'BTC']

    def test_empty_conversion(self):
        validCurrencies = ['USD','BRL', 'BTC']
        conversionModel = {}
        expectedDict = {
            'from': 'from is required',
            'to': 'to is required',
            'amount': 'amount is required'
        }

        isValidDict = Conversion.is_valid(conversionModel,validCurrencies) 
        
        self.assertDictEqual(isValidDict, expectedDict)

    def test_valid_conversion(self):
        validCurrencies = ['USD','BRL', 'BTC']
        conversionModel = {
            'from': 'BRL', 
            'to':'USD',
            'amount': '1'
        }

        isValidDict = Conversion.is_valid(conversionModel,validCurrencies) 

        self.assertDictEqual(isValidDict, {})

    def test_amount_negative(self):
        validCurrencies = ['USD','BRL', 'BTC']
        conversionModel = {
            'from': 'BRL', 
            'to':'USD',
            'amount': '-.1'
        }
        expectedDict = {
            'amount': 'amount (-0.1) must be a positive decimal'
        }

        isValidDict = Conversion.is_valid(conversionModel,validCurrencies) 

        self.assertDictEqual(isValidDict, expectedDict)
    
    def test_amount_with_comma(self):
        validCurrencies = ['USD','BRL', 'BTC']
        conversionModel = {
            'from': 'BRL', 
            'to':'USD',
            'amount': '1,0'
        }
        expectedDict = {
            'amount': 'amount (1,0) is an invalid positive decimal. Use ''.'' for decimal separator'
        }

        isValidDict = Conversion.is_valid(conversionModel,validCurrencies) 

        self.assertDictEqual(isValidDict, expectedDict)
    
    def test_amount_missing(self):
        validCurrencies = ['USD','BRL', 'BTC']
        conversionModel = {
            'from': 'BRL', 
            'to':'USD'
        }
        expectedDict = {
            'amount': 'amount is required'
        }

        isValidDict = Conversion.is_valid(conversionModel,validCurrencies) 

        self.assertDictEqual(isValidDict, expectedDict)
    
    def test_amount_invalid(self):
        validCurrencies = ['USD','BRL', 'BTC']
        conversionModel = {
            'from': 'BRL', 
            'to':'USD',
            'amount':'string content'
        }
        expectedDict = {
            'amount': 'amount (string content) is an invalid positive decimal. Use ''.'' for decimal separator'
        }

        isValidDict = Conversion.is_valid(conversionModel,validCurrencies) 

        self.assertDictEqual(isValidDict, expectedDict)

    def test_from_missing(self):
        validCurrencies = ['USD','BRL', 'BTC']
        conversionModel = {
            'to':'USD',
            'amount':'1.0'
        }
        expectedDict = {
            'from': 'from is required'
        }

        isValidDict = Conversion.is_valid(conversionModel,validCurrencies) 

        self.assertDictEqual(isValidDict, expectedDict)
    
    def test_from_not_supported(self):
        validCurrencies = ['BRL', 'BTC']
        conversionModel = {
            'from':'USD',
            'to':'BTC',
            'amount':'1.0'
        }
        expectedDict = {
            'from': "from (USD) is invalid among permitted currencies: ['BRL', 'BTC']"
        }

        isValidDict = Conversion.is_valid(conversionModel,validCurrencies) 

        self.assertDictEqual(isValidDict, expectedDict)

    def test_to_missing(self):

        validCurrencies = ['USD','BRL', 'BTC']
        conversionModel = {
            'from': 'BRL',
            'amount': '1.0'
        }
        expectedDict = {
            'to': 'to is required'
        }

        isValidDict = Conversion.is_valid(conversionModel,validCurrencies) 

        self.assertDictEqual(isValidDict, expectedDict)
    
    def test_to_not_supported(self):
        validCurrencies = ['BRL', 'BTC']
        conversionModel = {
            'from':'BRL',
            'to':'USD',
            'amount':'1.0'
        }
        expectedDict = {
            'to': "to (USD) is invalid among permitted currencies: ['BRL', 'BTC']"
        }

        isValidDict = Conversion.is_valid(conversionModel,validCurrencies) 

        self.assertDictEqual(isValidDict, expectedDict)

if __name__ == '__main__':
    unittest.main()
