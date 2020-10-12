from main.service.sources import Sources
from main.repository.rate import Rate
from main.routes import api
from main.app import app
from bson import ObjectId

import unittest



class TestSources(unittest.TestCase):

    def setUp(self):
        self.app = app
        self.app.config['TESTING'] = True
        self.client = app.test_client()
        self.payload = {'its': 'empty'}

    def tearDown(self):
        pass

    def test_rate_object(self):
        repository = Rate()
        object1 = repository.create({'engine': 'exchangerate', 'currency': 'BRL', 'rate': 5.577212, 'time': 1602288243})
        self.assertTrue('_id' in object1)
        object2 = repository.find({'_id': ObjectId(object1['_id'])})
        self.assertGreater(len(object2), 0)
        resultd = repository.delete_many({'_id': ObjectId(object1['_id'])})
        self.assertEqual(resultd.deleted_count, 1)

    def test_actions_currencies(self):
        result1 = Sources().delete_rates(['USD','BRL']);
        result2 = Sources().get_rates(['USD','BRL']);
        self.assertTrue('USD' in result2)
        self.assertTrue('BRL' in result2)
        self.assertIsNone(result2['USD'])
        self.assertIsNone(result2['BRL'])
        result3 = Sources().add_rates(['USD','BRL']);
        self.assertTrue('USD' in result3)
        self.assertTrue('BRL' in result3)
        self.assertIsNotNone(result3['USD'])
        self.assertIsNotNone(result3['BRL'])

    def test_get_api(self):
        self.RESOURCE_URL = "/api/v1/"
        response = self.client.get(self.RESOURCE_URL, json={})
        self.assertEqual(response.status_code, 200)
        self.assertDictEqual(response.get_json(), {'up': True})

    def test_get_exchanges(self):
        Sources().add_rates(['USD', 'BRL']);
        self.RESOURCE_URL = "/api/v1/exchanges"
        response = self.client.get(self.RESOURCE_URL, json={'from':'USD','to':'BRL','amount':123.45})
        self.assertEqual(response.status_code, 200)
        self.assertDictEqual(response.get_json(), {'from': {'currency': 'USD', 'value': 123.45}, 'to': {'currency': 'BRL', 'value': 688.51}})

    def test_get_currencies(self):
        Sources().add_rates(['BRL']);
        response = self.client.get("/api/v1/currencies", json={'currency':'BRL'})
        object = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual('BRL',object['currency'])

    def test_post_currencies(self):
        Sources().delete_rates(['BRL']);
        response = self.client.post('/api/v1/currencies', json={"currency": "BRL"})
        object = response.get_json()
        self.assertEqual(response.status_code, 201)
        self.assertEqual('BRL',object['currency'])

    def test_delete_currencies(self):
        Sources().add_rates(['BRL']);
        response = self.client.delete('/api/v1/currencies/BRL')
        self.assertEqual(response.status_code, 204)

if __name__ == '__main__':
    unittest.main()