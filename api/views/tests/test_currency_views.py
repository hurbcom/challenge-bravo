import json

from api.tests.test_base import TestBase


class TestCurrenciesView(TestBase):
    url = '/currencies/'

    def test_put_currencies_should_return_not_implemented(self):
        response = self.test_app.put(self.url)
        self.assertEqual(response.status_code, 405)

    def test_delete_currencies_should_return_not_implemented(self):
        response = self.test_app.delete(self.url)
        self.assertEqual(response.status_code, 405)

    def test_get_currencies_should_return_ok(self):
        response = self.test_app.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_get_currencies_should_return_json(self):
        response = self.test_app.get(self.url)
        self.assertEqual(response.content_type, 'application/json')

    def test_get_currencies_should_return_a_currencies_list(self):
        response = self.test_app.get(self.url)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(data, {
            'count': 2,
            'results': [
                {
                    'id': 'USD',
                    'rate': 1.00
                }, {
                    'id': 'BRL',
                    'rate': 5.15
                }
            ]
        })

    def test_post_currencies_should_return_created(self):
        response = self.test_app.post(self.url, json={'id': 'EUR'})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.content_type, 'application/json')

    def test_post_currencies_should_return_currency_information(self):
        response = self.test_app.post(self.url, json={'id': 'EUR'})
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(data, {
            'id': 'EUR',
            'rate': 1.00
        })

    def test_post_currencies_should_return_conflict_when_duplicate(self):
        response = self.test_app.post(self.url, json={'id': 'USD'})
        self.assertEqual(response.status_code, 409)


class TestCurrencieDeleteView(TestBase):
    url = '/currencies/BRL/'

    def test_delete_currencies_should_return_ok(self):
        response = self.test_app.delete(self.url)
        self.assertEqual(response.status_code, 204)

    def test_delete_currencies_should_not_found_when_id_is_wrong(self):
        response = self.test_app.delete('/currencies/WRONG/')
        self.assertEqual(response.status_code, 404)