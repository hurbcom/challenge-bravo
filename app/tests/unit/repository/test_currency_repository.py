from models.currency import CurrencyModel
from parameterized import parameterized
from repository.currency_repository import CurrencyRepository
import pytest
import unittest

MOCK_FAKE_CURRENCY = CurrencyModel("VTR",
                                   "Victor currencies",
                                   "Made by my code")
MOCK_INITIAL_CURRENCIES = ["USD", "BRL", "EUR", "BTC", "ETH"]


class TestCurrencyRepository(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls._repo = CurrencyRepository()

    def test_initial_currencies(self):
        r = CurrencyRepository()
        currencies = r.get_currencies()
        codes = [c.code for c in currencies]
        self.assertEqual(len(currencies), 5)
        self.assertEqual(self._repo.get_currencies(),
                         r.get_currencies())
        self.assertEqual(sorted(codes),
                         sorted(MOCK_INITIAL_CURRENCIES))

    @parameterized.expand(MOCK_INITIAL_CURRENCIES)
    def test_get_avaiable_code(self, code):
        self.assertIsNotNone(self._repo.get_currency_by_code(code))

    def test_get_invalid_code(self):
        self.assertIsNone(self._repo.get_currency_by_code('XPTO'))

    def test_insert_method(self):
        self._repo.insert(MOCK_FAKE_CURRENCY)
        self.assertIsNotNone(self._repo._CURRENCIES.index(MOCK_FAKE_CURRENCY))

    def test_delete_method(self):
        self._repo.delete(MOCK_FAKE_CURRENCY.code)
        with pytest.raises(ValueError):
            self._repo._CURRENCIES.index(MOCK_FAKE_CURRENCY)

    def test_insert_delete_get(self):
        self._repo.insert(MOCK_FAKE_CURRENCY)
        self.assertIsNotNone(
            self._repo.get_currencies().index(MOCK_FAKE_CURRENCY)
        )
        self._repo.delete(MOCK_FAKE_CURRENCY.code)
        self.assertIsNone(
            self._repo.get_currency_by_code(MOCK_FAKE_CURRENCY.code)
        )
