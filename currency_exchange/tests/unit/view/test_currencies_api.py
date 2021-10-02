from unittest import TestCase
import requests
import json

from app import HOST, PORT

URL_ADDRESS = f"http://{HOST}:{PORT}"


class ViewCurrenciesApiTesting(TestCase):
    header = {'content-type': 'application/json'}

    def test_disable_all_currencies_from_api(self):
        # Title: Disable all Currencies from API endpoint.
        # step 1: Find all symbols in database and insert in list
        # step 2: Do a for in the list and if the symbol is avialable, do the unavailable.
        # Expected result: If the symbol is available, it will unavailable the currency.

        from currency_exchange.blueprints.database.read import reading_all_symbols_from_table_exchange_rate
        all_symbols = reading_all_symbols_from_table_exchange_rate()

        for symbol in all_symbols:
            if symbol.available is True:
                url = f"{URL_ADDRESS}/currencies"
                data_content = {"symbol": symbol.symbol, "available": False}
                requests.post(url, data=json.dumps(data_content), headers=self.header)
                req = requests.get(f"{URL_ADDRESS}/currencies")
                req_json = req.json()
                self.assertNotIn(symbol.symbol, req_json)

    def test_enable_all_currencies_from_api(self):
        # Title: Enable all Currencies from API endpoint.
        # step 1: Find all symbols in database and insert in list
        # step 2: Do a for in the list and if the symbol is unavailable, do the available.
        # Expected result: If the symbol is unavailable, it will avialable the currency.

        from currency_exchange.blueprints.database.read import reading_all_symbols_from_table_exchange_rate
        all_symbols_from_database = reading_all_symbols_from_table_exchange_rate()

        for symbol in all_symbols_from_database:
            if symbol.available is False:
                url = f"{URL_ADDRESS}/currencies"
                data_content = {"symbol": symbol.symbol, "available": True}
                requests.post(url, data=json.dumps(data_content), headers=self.header)
                req = requests.get(f"{URL_ADDRESS}/currencies")
                req_json = req.json()
                self.assertIn(symbol.symbol, req_json)

    def test_add_new_currency(self):
        # Title: Add a new currency from API endpoint
        # step 1: Unavailable all currencies
        # step 2: Do a API post in endpoint /currencies and insert a symbol and rate thats is not in database
        # step 3: The API endpoint must response with right value
        # step 4: find the currency added in step 2 in the /currencies endpoint
        # Expeted result: The API endpoint must add sucessfully the currency.

        from currency_exchange.blueprints.utils.randomReturn import randomic_letters_uppercase
        from currency_exchange.blueprints.utils.randomReturn import random_float_number

        self.test_enable_all_currencies_from_api()
        url = f"{URL_ADDRESS}/currencies"
        symbol_random = randomic_letters_uppercase(10)
        rate_random = random_float_number()
        data_content = {"symbol": symbol_random, "rate": rate_random}
        requests.post(url, data=json.dumps(data_content), headers=self.header)
        r_get = requests.get(url, data=json.dumps(data_content), headers=self.header)
        json_request = r_get.json()
        self.assertIn(symbol_random, json_request)

    def test_delete_specific_currency(self):
        # Title: from currencies API endpoint, do a delete and verify its unavailable
        # step 1: Enable all currencies from database.
        # step 2: Do a delete method in API endpoint /currencies with a valid symbol
        # Expected result: The currency must be unavailable in currencies endpoint API.

        self.test_enable_all_currencies_from_api()
        url = f"{URL_ADDRESS}/currencies"
        data_content = {"symbol": "USD"}
        r = requests.delete(url, data=json.dumps(data_content), headers=self.header)
        self.assertEqual(first=r.status_code, second=200)
        req = requests.get(f"{URL_ADDRESS}/currencies")
        req_json = req.json()
        self.assertNotIn("USD", req_json)

    def test_disable_currency_verify_all_currencies(self):
        # Title: Disable the currency from post endpoint API and valid its unavailable.
        # step 1: Enable all currencies
        # step 2: Do a POST in currencie API endpoint with valid symbol and available in False
        # step 3: The symbol must be deleted
        # Expected Result: The symbol must be deleted sucessfully.

        self.test_enable_all_currencies_from_api()
        url = f"{URL_ADDRESS}/currencies"
        data_content = {"symbol": "BRL", "available": False}
        r = requests.post(url, data=json.dumps(data_content), headers=self.header)
        self.assertEqual(first=r.status_code, second=200)
        req = requests.get(f"{URL_ADDRESS}/currencies").json()
        self.assertNotIn("BRL", req)

    def test_disable_from_post_currency_try_convert(self):
        # Title: Disable the currency
        # step 1: Enable all currencies from API
        # step 2: Do a POST in API endpoint with symbol and available = False
        # step 3: Verify the status code = 200, it indicate that the currency was disabled.
        # Expected result: The page must return the 200 status code.

        self.test_enable_all_currencies_from_api()
        url = f"{URL_ADDRESS}/currencies"
        data_content = {"symbol": "BRL", "available": False}
        r = requests.post(url, data=json.dumps(data_content), headers=self.header)
        self.assertEqual(first=r.status_code, second=200)

    def test_delete_all_currencies(self):
        # Title: Delete all currencies from API currencies endpoint
        # step 1: enable all currencies from API endpoint
        # step 2: read all symbols from database
        # step 3: Read each symbol in database and delete it in endpoint with delete method
        # Expected Result: The symbol must be deleted sucessfuly.

        self.test_enable_all_currencies_from_api()
        from currency_exchange.blueprints.database.read import reading_all_symbols_from_table_exchange_rate
        all_symbols = reading_all_symbols_from_table_exchange_rate()

        for symbol in all_symbols:
            if symbol.available:
                data_content = {"symbol": symbol.symbol}
                url = f"{URL_ADDRESS}/currencies"
                requests.delete(url, data=json.dumps(data_content), headers=self.header)
                req = requests.get(f"{URL_ADDRESS}/currencies")
                req_json = req.json()
                self.assertNotIn(symbol.symbol, req_json)

    def test_delete_currency_without_symbol(self):
        # Title: Delete a currency without insert the symbol in Body
        # step 1: Enable all currencies from API
        # step 2: Try to delete a currency without give a symbol in body of json
        # Expected result: It should return a status code 409 and not be able to delete a currency

        self.test_enable_all_currencies_from_api()
        url = f"{URL_ADDRESS}/currencies"
        data_content = {"available": True}
        delete_method = requests.delete(url, data=json.dumps(data_content), headers=self.header)
        self.assertEqual(delete_method.status_code, 409)

    def test_insert_new_currency_without_rate(self):
        # Title: Try to insert a new currency without give the rate in body
        # step 1: Try to do a POST METHOD in currencies API endpoint without the rate, only with the symbol
        # step 2: Verify the status code and check it return the 409
        # Expected Result: The status code must return the 409

        url = f"{URL_ADDRESS}/currencies"
        data_content = {"symbol": "JJJJJJJJJ"}
        post_method = requests.post(url, data=json.dumps(data_content), headers=self.header)
        self.assertEqual(post_method.status_code, 409)

    def test_insert_new_currency_without_symbol(self):
        # Title: Try to insert a new currency without symbol in JSON body
        # step 1: Try to do a POST METHOD in currencies API endpoint without the SYMBOL, only with the rate
        # step 2: Verify the status code and check it return the 409
        # Expected result: The status code must return the 409

        url = f"{URL_ADDRESS}/currencies"
        data_content = {"rate": 1.1}
        post_method = requests.post(url, data=json.dumps(data_content), headers=self.header)
        self.assertEqual(post_method.status_code, 409)
