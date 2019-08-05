import unittest

from src.contracts.currencyconversion.currencyconversionapi import CurrencyConversionApi

# Test from the repo main with: "python3 -m pytest"

class CurrencyConversionApiTests(unittest.TestCase):

    # helpers:
    def assertRaisesWithMessage(self, exceptionType, msg, func, *args, **kwargs):
        try:
            func(*args, **kwargs)
            self.fail()

        except exceptionType as inst:
            self.assertEqual(str(inst), msg)

    # Tests:
    def test_currencyprovider_valid(self):

        class TestSubClass(metaclass=CurrencyConversionApi):
            validCurrencies = ['USD', 'BRL']

            def convert(self):
                pass
        
        testClass = TestSubClass()

    def test_currencyprovider_missing_valid_currencies(self):
    
        def createTestClass():
            class TestSubClass(metaclass=CurrencyConversionApi):

                def convert(self):
                    pass

        self.assertRaisesWithMessage(
             NotImplementedError,
            'Subclass TestSubClass must have a list of (non-empty) strings called validCurrencies containing all possible currency conversion arguments',
             createTestClass)

    def test_currencyprovider_invalid_currencies(self):
        
        def createTestClass1():
            class TestSubClass(metaclass=CurrencyConversionApi):
                validCurrencies = [None]
                def convert(self):
                    pass
        
        def createTestClass2():
            class TestSubClass(metaclass=CurrencyConversionApi):
                validCurrencies = [1]
                def convert(self):
                    pass
        
        def createTestClass3():
            class TestSubClass(metaclass=CurrencyConversionApi):
                validCurrencies = ['']
                def convert(self):
                    pass
        def createTestClass4():
            class TestSubClass(metaclass=CurrencyConversionApi):
                validCurrencies = [{}]
                def convert(self):
                    pass
        def createTestClass5():
            class TestSubClass(metaclass=CurrencyConversionApi):
                validCurrencies = [[], 'BRL']
                def convert(self):
                    pass
        def createTestClass6():
            class TestSubClass(metaclass=CurrencyConversionApi):
                validCurrencies = []
                def convert(self):
                    pass

        validCurrenciesError = 'Subclass TestSubClass must have a list of (non-empty) strings called validCurrencies containing all possible currency conversion arguments'

        self.assertRaisesWithMessage(NotImplementedError, validCurrenciesError, createTestClass1)
        self.assertRaisesWithMessage(NotImplementedError, validCurrenciesError, createTestClass2)
        self.assertRaisesWithMessage(NotImplementedError, validCurrenciesError, createTestClass3)
        self.assertRaisesWithMessage(NotImplementedError, validCurrenciesError, createTestClass4)
        self.assertRaisesWithMessage(NotImplementedError, validCurrenciesError, createTestClass5)
        self.assertRaisesWithMessage(NotImplementedError, validCurrenciesError, createTestClass6)

    def test_currencyprovider_missing_convert_method(self):
        def createTestClass():
            class TestSubClass(metaclass=CurrencyConversionApi):
                validCurrencies = ['USD', 'BRL']

        expectedErrorMessage ='Subclass TestSubClass must implement a ''convert(conversionRequest)'' method receiving the correct parameter'

        self.assertRaisesWithMessage(
            NotImplementedError,
            expectedErrorMessage,
            createTestClass
        )
        
