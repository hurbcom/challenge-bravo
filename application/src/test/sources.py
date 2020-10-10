from main.service.sources import Sources
from main.repository.rate import Rate
from main.controller.exchanges import Exchanges
from main.routes import api


from flask_restful.utils import http_status_message, unpack
from flask_restful.fields import Raw
from flask_restful import OrderedDict, marshal_with
from main.app import app, api


import unittest
import json
from bson import ObjectId



class TestSources(unittest.TestCase):

    # def test_rate_object(self):
    #     repository = Rate()
    #     object1 = repository.create({'engine': 'exchangerate', 'currency': 'BRL', 'rate': 5.577212, 'time': 1602288243})
    #     self.assertTrue('_id' in object1)
    #     object2 = repository.find({'_id': ObjectId(object1['_id'])})
    #     self.assertGreater(len(object2), 0)
    #     resultd = repository.delete_many({'_id': ObjectId(object1['_id'])})
    #     self.assertEqual(resultd.deleted_count, 1)
    #
    # def test_actions_currencies(self):
    #     result1 = Sources().delete_rates(['USD','BRL']);
    #     result2 = Sources().get_rates(['USD','BRL']);
    #     self.assertTrue('USD' in result2)
    #     self.assertTrue('BRL' in result2)
    #     self.assertIsNone(result2['USD'])
    #     self.assertIsNone(result2['BRL'])
    #     result3 = Sources().add_rates(['USD','BRL']);
    #     self.assertTrue('USD' in result3)
    #     self.assertTrue('BRL' in result3)
    #     self.assertIsNotNone(result3['USD'])
    #     self.assertIsNotNone(result3['BRL'])

    def test_http_code(self):
        self.assertEqual(http_status_message(200), 'OK')
        self.assertEqual(http_status_message(404), 'Not Found')

    def setUp(self):
        self.app = app
        self.app.config['TESTING'] = True
        self.client = app.test_client()
        self.payload = {'its': 'empty'}

    def tearDown(self):
        pass

    def test_get_response(self):
        self.RESOURCE_URL = "/api/v1/"
        response = self.client.get(self.RESOURCE_URL, json={})
        self.assertEqual(response.status_code, 200)
        self.assertDictEqual(response.get_json(), {'up': True})

    def test_get_response2(self):
        Sources().add_rates(['USD', 'BRL']);

        self.RESOURCE_URL = "/api/v1/exchanges"
        response = self.client.get(self.RESOURCE_URL, json={'from':'USD','to':'BRL','amount':123.45})
        self.assertEqual(response.status_code, 200)
        self.assertDictEqual(response.get_json(), {'from': {'currency': 'USD', 'value': 123.45}, 'to': {'currency': 'BRL', 'value': 688.51}})

if __name__ == '__main__':
    unittest.main()