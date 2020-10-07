from main.service.exchangerate import Exchangerate
from main.repository.currency import Currency

import unittest


class TestStringMethods(unittest.TestCase):

    def test_upper(self):
        self.assertEqual('foo'.upper(), 'FOO')

    def test_currency_find(self):
        source = Currency.find({"not":"findit!"})
        self.assertEqual(source.count(True), 0)


if __name__ == '__main__':
    unittest.main()