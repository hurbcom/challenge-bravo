import unittest
import requests
from currency_conversion.api.validate import *


class TestUnitValidate(unittest.TestCase):
    def test_validate_from_true(self):
        value = 'USD'
        assert_equal = validate_from(value)
        self.assertEqual(True, assert_equal)

    def test_validate_from_false(self):
        value = 'USDD'
        assert_equal = validate_from(value)
        self.assertEqual(False, assert_equal)

    def test_validate_amount_true(self):
        value = 100.00
        assert_equal = validate_amount(value)
        self.assertEqual(True, assert_equal)

    def test_validate_amount_string_false(self):
        value = 'test'
        assert_equal = validate_amount(value)
        self.assertEqual(False, assert_equal)

