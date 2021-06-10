import unittest

from challenge_bravo.repositories.mongodb import Mongodb
from challenge_bravo.utils.config import Config
from main import app


class ConvertIntegrationTest(unittest.TestCase):
    Config.MONGODB_DATABASE = 'test'

    def setUp(self):
        self.app = app.test_client()
        self.db = Mongodb(Config).db

    def test_conversion_between_existing_currencies(self):
        response = self.app.get('/convert?from=BRL&to=BTC&amount=10')
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.json['result'])

    def test_conversion_between_1_fake_one_existing(self):
        self.db.currencies.insert_one({
            'currency_name': 'AAA',
            'currency_value_in_usd': 12,
            'code': 'AAA'
        })

        response = self.app.get('/convert?from=AAA&to=USD&amount=10')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['result'], 120)

    def test_conversion_between_2_fakes(self):
        self.db.currencies.insert_one({
            'currency_name': 'CCC',
            'currency_value_in_usd': 3,
            'code': 'CCC'
        })

        self.db.currencies.insert_one({
            'currency_name': 'HURB',
            'currency_value_in_usd': 12,
            'code': 'HURB'
        })

        response = self.app.get('/convert?from=CCC&to=HURB&amount=10')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['result'], 2.5)

    def tearDown(self):
        for collection in self.db.list_collection_names():
            self.db.drop_collection(collection)
