import unittest
from currency_conversion.api.validate import validate_from, validate_amount


class TestUnitValidate(unittest.TestCase):
    def test_validate_from_true(self):
        value = 'USD'
        expected = validate_from(value)
        self.assertEqual(True, expected)

    def test_validate_from_false(self):
        value = 'USDD'
        expected = validate_from(value)
        self.assertEqual(False, expected)

    def test_validate_amount_true(self):
        value = 100.00
        expected = validate_amount(value)
        self.assertEqual(True, expected)

    def test_validate_amount_string_false(self):
        value = 'test'
        expected = validate_amount(value)
        self.assertEqual(False, expected)
