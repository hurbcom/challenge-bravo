from tests.integration.web_api.test_case_base import TestCaseBase


class TestCaseTagsFilter(TestCaseBase):
    def test_get(self):
        payload = {
            "from": "USD",
            "to": "BRL",
            "amount": 123.45
        }
        resp = self.client.get("/huby/currencies/converter", json=payload)
        self.assertEqual(resp.status_code, 200)

        resp = self.client.get("/huby/currencies/converter?from=USD&to=BRL&amount=123.46")
        self.assertEqual(resp.status_code, 200)

        null_payload = {}
        null_resp = self.client.get("/huby/currencies/converter", json=null_payload)
        self.assertEqual(null_resp.status_code, 400)

        # null_resp = self.client.get("/huby/currencies/converter")
        # self.assertEqual(null_resp.status_code, 200)

        from_missing_payload = {
            "to": "BRL",
            "amount": 123.45
        }
        missing_resp = self.client.get("/huby/currencies/converter", json=from_missing_payload)
        self.assertEqual(missing_resp.status_code, 400)

        missing_resp = self.client.get("/huby/currencies/converter?to=BRL&amount=123.46")
        self.assertEqual(missing_resp.status_code, 400)

        to_missing_payload = {
            "from": "USD",
            "amount": 123.45
        }
        missing_resp = self.client.get("/huby/currencies/converter", json=to_missing_payload)
        self.assertEqual(missing_resp.status_code, 400)

        missing_resp = self.client.get("/huby/currencies/converter?from=USD&amount=123.46")
        self.assertEqual(missing_resp.status_code, 400)

        amount_missing_payload = {
            "from": "USD",
            "to": "BRL",
        }
        missing_resp = self.client.get("/huby/currencies/converter", json=amount_missing_payload)
        self.assertEqual(missing_resp.status_code, 400)

        missing_resp = self.client.get("/huby/currencies/converter?from=USD&to=BRL")
        self.assertEqual(missing_resp.status_code, 400)

        currency_not_exists_payload = {
            "from": "KKK",
            "to": "BRL",
            "amount": 123.45
        }
        missing_resp = self.client.get("/huby/currencies/converter", json=currency_not_exists_payload)
        self.assertEqual(missing_resp.status_code, 404)

        missing_resp = self.client.get("/huby/currencies/converter?from=KKK&to=BRL&amount=123.46")
        self.assertEqual(missing_resp.status_code, 404)

        currency_not_exists_payload = {
            "from": "USD",
            "to": "WWW",
            "amount": 123.45
        }
        missing_resp = self.client.get("/huby/currencies/converter", json=currency_not_exists_payload)
        self.assertEqual(missing_resp.status_code, 404)

        missing_resp = self.client.get("/huby/currencies/converter?from=USD&to=WWW&amount=123.46")
        self.assertEqual(missing_resp.status_code, 404)
