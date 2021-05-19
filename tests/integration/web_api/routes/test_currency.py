from tests.integration.web_api.test_case_base import TestCaseBase


class TestCaseCurrency(TestCaseBase):
    def test_get(self):
        resp = self.client.get("/hurby/currency")
        self.assertEqual(resp.status_code, 200)

    def test_post(self):
        payload = {
            "id": "HURBYDELETE",
            "name": "HURBy's Currency"
        }
        mock_resp = {
            "success": True,
            "message": "Currency Id: HURBYDELETE was successfully created. "
        }
        resp = self.client.post("/hurby/currency", json=payload)
        self.custom_assert(response=resp, status_code=201, data_comper=mock_resp)

        payload = {
            "id": "HURBYCONVERTER",
            "name": "HURBy's Currency"
        }
        mock_resp = {
            "success": True,
            "message": "Currency Id: HURBYCONVERTER was successfully created. "
        }
        resp = self.client.post("/hurby/currency", json=payload)
        self.custom_assert(response=resp, status_code=201, data_comper=mock_resp)


class TestCaseCurrencyId(TestCaseBase):
    def test_delete(self):
        id_ = "HURBYDELETE"
        mock_resp = {
            "success": True,
            "message": "Currency Id: HURBYDELETE was successfully deleted. "
        }
        resp = self.client.delete(f"/hurby/currency/{id_}")
        self.custom_assert(response=resp, status_code=200, data_comper=mock_resp)


class TestCaseCurrencyConverter(TestCaseBase):
    def test_get(self):
        """########## fields Ok ##########"""
        payload = {
            "from": "USD",
            "to": "BRL",
            "amount": 123.45
        }
        resp = self.client.get("/hurby/currency/converter", json=payload)
        self.assertEqual(resp.status_code, 200)

        resp = self.client.get("/hurby/currency/converter?from=USD&to=BRL&amount=123.45")
        self.assertEqual(resp.status_code, 200)

        payload = {
            "from": "BTC",
            "to": "USD",
            "amount": 123.46
        }
        resp = self.client.get("/hurby/currency/converter", json=payload)
        self.assertEqual(resp.status_code, 200)

        resp = self.client.get("/hurby/currency/converter?from=BTC&to=USD&amount=123.46")
        self.assertEqual(resp.status_code, 200)

        """########## 'from' field fictitious assuming default currency (USD) ##########"""
        payload = {
            "from": "HURBYCONVERTER",
            "to": "BRL",
            "amount": 123.45
        }
        resp = self.client.get("/hurby/currency/converter", json=payload)
        self.assertEqual(resp.status_code, 200)

        resp = self.client.get("/hurby/currency/converter?from=HURBYCONVERTER&to=BRL&amount=123.45")
        self.assertEqual(resp.status_code, 200)

        """########## 'to' field fictitious assuming default currency (USD) ##########"""
        payload = {
            "from": "EUR",
            "to": "HURBYCONVERTER",
            "amount": 123.45
        }
        resp = self.client.get("/hurby/currency/converter", json=payload)
        self.assertEqual(resp.status_code, 200)

        resp = self.client.get("/hurby/currency/converter?from=EUR&to=HURBYCONVERTER&amount=123.45")
        self.assertEqual(resp.status_code, 200)

        # ***deleting currency fictitious
        resp = self.client.delete(f"/hurby/currency/HURBYCONVERTER")
        self.assertEqual(resp.status_code, 200)

        """########## All fields missing ##########"""
        null_payload = {}
        null_resp = self.client.get("/hurby/currency/converter", json=null_payload)
        self.assertEqual(null_resp.status_code, 400)

        """########## field 'from' missing ##########"""
        from_missing_payload = {
            "to": "BRL",
            "amount": 123.45
        }
        missing_resp = self.client.get("/hurby/currency/converter", json=from_missing_payload)
        self.assertEqual(missing_resp.status_code, 400)

        missing_resp = self.client.get("/hurby/currency/converter?to=BRL&amount=123.45")
        self.assertEqual(missing_resp.status_code, 400)

        """########## field 'to' missing ##########"""
        to_missing_payload = {
            "from": "USD",
            "amount": 123.45
        }
        missing_resp = self.client.get("/hurby/currency/converter", json=to_missing_payload)
        self.assertEqual(missing_resp.status_code, 400)

        missing_resp = self.client.get("/hurby/currency/converter?from=USD&amount=123.45")
        self.assertEqual(missing_resp.status_code, 400)

        """########## field 'amount' missing ##########"""
        amount_missing_payload = {
            "from": "USD",
            "to": "BRL",
        }
        missing_resp = self.client.get("/hurby/currency/converter", json=amount_missing_payload)
        self.assertEqual(missing_resp.status_code, 400)

        missing_resp = self.client.get("/hurby/currency/converter?from=USD&to=BRL")
        self.assertEqual(missing_resp.status_code, 400)

        """########## Currency field 'from' not exists in database ##########"""
        currency_not_exists_payload = {
            "from": "XYZKKK",
            "to": "BRL",
            "amount": 123.45
        }
        missing_resp = self.client.get("/hurby/currency/converter", json=currency_not_exists_payload)
        self.assertEqual(missing_resp.status_code, 404)

        missing_resp = self.client.get("/hurby/currency/converter?from=XYZKKK&to=BRL&amount=123.45")
        self.assertEqual(missing_resp.status_code, 404)

        """########## Currency field 'to' not exists in database ##########"""
        currency_not_exists_payload = {
            "from": "USD",
            "to": "WWWXYZ",
            "amount": 123.45
        }
        missing_resp = self.client.get("/hurby/currency/converter", json=currency_not_exists_payload)
        self.assertEqual(missing_resp.status_code, 404)

        missing_resp = self.client.get("/hurby/currency/converter?from=USD&to=WWWXYZ&amount=123.45")
        self.assertEqual(missing_resp.status_code, 404)

        """########## Currencies combination not supported by the API ##########"""
        payload = {
            "from": "CAD",  # Dólar Canadense
            "to": "AUD",  # Dólar Australiano
            "amount": 123.45
        }
        mock_resp = {
            "success": False,
            "message": "Currencies combination not supported by the API. "
        }
        resp = self.client.get("/hurby/currency/converter", json=payload)
        self.custom_assert(response=resp, status_code=400, data_comper=mock_resp)

        resp = self.client.get("/hurby/currency/converter?from=CAD&to=AUD&amount=123.45")
        self.custom_assert(response=resp, status_code=400, data_comper=mock_resp)
