import json
import unittest

from challenge_bravo.repositories.mongodb import Mongodb
from challenge_bravo.utils.config import Config
from main import app


class CurrenciesIntegrationTest(unittest.TestCase):
    Config.MONGODB_DATABASE = 'test'

    def setUp(self):
        self.app = app.test_client()
        self.db = Mongodb(Config).db

    def test_currency_crud(self):

        # Test add a currency
        payload = {
            'code': 'ABC',
            'currency_value_in_usd': 23,
            'currency_name': 'ABC'
        }

        response = self.app.post('/currencies', headers={"Content-Type": "application/json"}, data=json.dumps(payload))
        result = self.db.currencies.find_one({'code': 'ABC'})
        self.assertEqual(result['code'], payload['code'])
        self.assertEqual(result['currency_value_in_usd'], payload['currency_value_in_usd'])
        self.assertEqual(result['currency_name'], payload['currency_name'])
        self.assertEqual(response.status_code, 201)

        # if currency already exists it should give an error
        payload = {
            'code': 'ABC',
            'currency_value_in_usd': 23,
            'currency_name': 'ABC'
        }

        response = self.app.post('/currencies', headers={"Content-Type": "application/json"}, data=json.dumps(payload))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json['message'], 'Error while validating data or code already exists')
        # Testing update currency including its unique code should give an error
        payload = {
            'code': 'ABR',
        }

        response = self.app.put(f'/currencies/ABC', headers={"Content-Type": "application/json"}, data=json.dumps(payload))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json['message'], 'You cant update currency code')
        # Testing update for allowed fields
        payload = {
            'currency_value_in_usd': 1,
        }

        response = self.app.put(f'/currencies/ABC', headers={"Content-Type": "application/json"},
                                data=json.dumps(payload))
        self.assertEqual(response.status_code, 200)
        result = self.db.currencies.find_one({'code': 'ABC'})
        self.assertEqual(result['code'], 'ABC')
        self.assertEqual(result['currency_value_in_usd'], 1)
        self.assertEqual(result['currency_name'], 'ABC')

        # Testing delete currency
        payload = {
            'code': 'AUO',
        }
        response = self.app.delete('/currencies', headers={"Content-Type": "application/json"}, data=json.dumps(payload))
        self.assertEqual(response.status_code, 200)
        result = self.db.currencies.find_one({'code': 'AUO'})
        self.assertIsNone(result)

    def test_get_currencies(self):
        response = self.app.get('/currencies', headers={"Content-Type": "application/json"})
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        for collection in self.db.list_collection_names():
            self.db.drop_collection(collection)