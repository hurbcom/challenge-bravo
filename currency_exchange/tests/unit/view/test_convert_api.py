from unittest import TestCase
import requests
import json

from challenge_bravo.app import HOST, PORT

URL_ADDRESS = f"http://{HOST}:{PORT}"


class ViewConvertApiTesting(TestCase):
    header = {'content-type': 'application/json'}

    def test_disable_all_currencies(self):
        # Title: Disable all currencies from API endpoint
        # step 1: Get all currencies from database and insert it into a list
        # step 2: Do a for in the list and if list is available, disable it doing a POST in API endpoint,
        #         the API endpoint must contains the symbol and available = False
        # Expected Result: The API endpoint must disable all currencies.

        from challenge_bravo.currency_exchange.blueprints.database.read import \
            reading_all_symbols_from_table_exchange_rate
        all_symbols = reading_all_symbols_from_table_exchange_rate()
        url = f"{URL_ADDRESS}/currencies"

        for symbol in all_symbols:
            if symbol.available is True:
                data_content = {"symbol": symbol.symbol, "available": False}
                r = requests.post(url, data=json.dumps(data_content), headers=self.header)
                self.assertEqual(r.status_code, 200)

    def test_enable_all_currencies(self):
        # Title: Enable all currencies from API endpoint
        # step 1: Get all currencies from database and insert it into a list
        # step 2: Do a for in the list and if list is unavailable, enable it doing a POST in API endpoint,
        #         the API endpoint must contains the symbol and available = True
        # Expected Result: The API endpoint must enable all currencies.

        from challenge_bravo.currency_exchange.blueprints.database.read import \
            reading_all_symbols_from_table_exchange_rate
        all_symbols = reading_all_symbols_from_table_exchange_rate()
        url = f"{URL_ADDRESS}/currencies"

        for symbol in all_symbols:
            if symbol.available is False:
                data_content = {"symbol": symbol.symbol, "available": True}
                r = requests.post(url, data=json.dumps(data_content), headers=self.header)
                self.assertEqual(r.status_code, 200)

    def test_convert_brl_to_usd(self):
        # Title: Converting the Currency BRL to USD in API endpoint /convert
        # step 1: Enable all currencies
        # step 2: Do a get in URL with params FROM, TO and AMOUNT
        # Expected result: The page must have a dict BRL(FROM), USD(TO) and amount(QNTITY).
        #                  The status code must be 200.

        self.test_enable_all_currencies()
        req = requests.get(f"{URL_ADDRESS}/convert?from=BRL&to=USD&amount=1")
        response = req.json()
        from_currency = response["from"]
        to_currency = response["to"]
        amount = response["amount"]
        self.assertEqual(first="BRL", second=from_currency)
        self.assertEqual(first="USD", second=to_currency)
        self.assertEqual(first="1", second=amount)
        self.assertEqual(first=req.status_code, second=200)

    def test_convert_usd_to_brl(self):
        # Title: Converting the Currency USD to BRL in API endpoint /convert
        # step 1: Enable all currencies
        # step 2: Do a get in URL with params FROM, TO and AMOUNT
        # Expected result: The page must have a dict USD(FROM), BRL(TO) and amount(QNTITY).
        #                  The status code must be 200.

        self.test_enable_all_currencies()
        req = requests.get(f"{URL_ADDRESS}/convert?from=USD&to=BRL&amount=1")
        response = req.json()
        from_currency = response["from"]
        to_currency = response["to"]
        amount = response["amount"]
        self.assertEqual(first='USD', second=from_currency)
        self.assertEqual(first='BRL', second=to_currency)
        self.assertEqual(first="1", second=amount)

    def test_currency_not_available_in_from(self):
        # Title: Do a currency exchange in a currency thats not available in database.
        # step 1: Enable all Currencies
        # step 2: Do a currency exchange in a currency thats not avialable in database in paramn FROM,
        #         it must return a 404 error in status code and the default text.

        self.test_enable_all_currencies()
        req = requests.get(f"{URL_ADDRESS}/convert?from=AAAAAAAAAAA&to=BRL&amount=1")
        response = req.json()
        response_json = response["error"]
        self.assertEqual(first=response_json, second="currency AAAAAAAAAAA not available in our database.")
        self.assertEqual(first=req.status_code, second=404)

    def test_currency_not_available_in_to(self):
        # Title: Do a currency exchange in a currency thats not available in database.
        # step 1: Enable all Currencies
        # step 2: Do a currency exchange in a currency thats not avialable in database in paramn TO,
        #         it must return a 404 error in status code and the default text.

        self.test_enable_all_currencies()
        req = requests.get(f"{URL_ADDRESS}/convert?from=BRL&to=AAAAAAAAAAA&amount=1")
        response = req.json()
        response_json = response["error"]
        self.assertEqual(first=response_json, second="currency AAAAAAAAAAA not available in our database.")
        self.assertEqual(first=req.status_code, second=404)

    def test_set_amount_and_verify_the_return(self):
        # Title: Set a amount quantity and verify it return in json correctly.
        # step 1: Enable all currencies from database.
        # step 2: Do a GET method in URL to convert from 2 currencies and set a amount
        # Expected Result: The GET URL must display the JSON with the same value set in URL.

        self.test_enable_all_currencies()
        req = requests.get(f"{URL_ADDRESS}/convert?from=USD&to=BRL&amount=1000")
        response = req.json()
        amount = response["amount"]
        self.assertEqual(first="1000", second=amount)

    def test_disable_currency_verify_converting_currency(self):
        # Title: Disable a custom currency and verify if the converting currency return a 404 error
        # step 1: Enable all currencies from database
        # step 2: Disable a custom currency from database
        # step 3: try to convert the currency disabled in step 2
        # Expected Result: The page must return the 404 error.

        self.test_enable_all_currencies()
        url = f"{URL_ADDRESS}/currencies"
        data_content = {"symbol": "BRL", "available": False}
        requests.post(url, data=json.dumps(data_content), headers=self.header)
        req = requests.get(f"{URL_ADDRESS}/convert?from=USD&to=BRL&amount=1")
        self.assertEqual(req.status_code, 404)

    def test_rehabilitate_currency_and_convert(self):
        # Title: Rehabilitate the currency and try to convert, its must return the right information
        # step 1: Disable all currencies from database
        # step 2: Enable one currency to use in FROM
        # step 3: Enable the another currency to use in TO
        # step 4: Try to convert the both currencies enabled in step 2 and 3.
        # Expected Result: Both currencies must be displayed in JSON in URL.

        self.test_disable_all_currencies()
        url = f"{URL_ADDRESS}/currencies"
        data_content = {"symbol": "BRL", "available": True}
        requests.post(url, data=json.dumps(data_content), headers=self.header)
        req = requests.get(f"{URL_ADDRESS}/currencies")
        self.assertIn("BRL", req.json())
        data_content = {"symbol": "USD", "available": True}
        requests.post(url, data=json.dumps(data_content), headers=self.header)
        req = requests.get(f"{URL_ADDRESS}/currencies")
        self.assertIn("USD", req.json())
        req = requests.get(f"{URL_ADDRESS}/convert?from=USD&to=BRL&amount=1")
        req_json = req.json()
        self.assertIn("USD", req_json["from"])
        self.assertIn("BRL", req_json["to"])

    def test_convert_all_currencies(self):
        # Title: Convert all symbols available in datase with USD ( including USD vs USD )
        # step 1: Enable all currencies from database
        # step 2: Get all database currencies and insert it into a list
        # step 3: Do all currencies convert the value with the USD, including the USD vs USD.
        # Expected Result: All currencies must be converted sucessfully and return the status code 200.

        self.test_enable_all_currencies()
        from challenge_bravo.currency_exchange.blueprints.database.read import \
            reading_all_symbols_from_table_exchange_rate
        all_symbols = reading_all_symbols_from_table_exchange_rate()
        for symbol in all_symbols:
            req_get = requests.get(f"{URL_ADDRESS}/convert?from={symbol.symbol}&to=USD&amount=1")
            self.assertEqual(req_get.status_code, 200)

    def test_convert_currency_without_amount(self):
        # Title: Convert 2 currencies available without set a AMOUNT param in URL
        # step 1: Enable all currencies
        # step 2: Do a GET in URL to convert 2 valids currencies
        # Expected result: It must return the AMOUNT = 1.

        self.test_enable_all_currencies()
        req = requests.get(f"{URL_ADDRESS}/convert?from=USD&to=BRL")
        req_json = req.json()
        self.assertEqual(int(req_json["amount"]), 1)


