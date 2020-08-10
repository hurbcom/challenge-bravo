from models.validators.validation import Validator
from db.database import Database
from datetime import date, datetime

import dateutil.parser
import requests, json


class Currency(object):
    def __init__(self):
        self.validator = Validator()
        self.db = Database()

        self.collection_name = 'currencies'

        self.fields = {
            "symbol": "string",
            "value": "double",
            "created_at": "datetime",
            "updated_at": "datetime",
        }

        self.create_required_fields = ["symbol"]
        self.create_optional_fields = ["value"]
        self.update_required_fields = ["value"]
        self.update_optional_fields = ["value","updated_at"]

    def create(self, currency):
        self.validator.validate(currency, self.fields, self.create_required_fields, self.create_optional_fields)

        currency_with_symbol = self.find_by_symbol(currency["symbol"])

        if not currency_with_symbol:
            currency["value"] = self.get_currency_value(currency)
            res = self.db.insert(currency, self.collection_name)
            return "Inserted Id " + res, 201
        else:
            return "Currency already exists", 409

    def find(self, currency):
        return self.db.find(currency, self.collection_name)

    def find_by_id(self, id):
        return self.db.find_by_id(id, self.collection_name)

    def find_by_symbol(self, symbol):
        currency = self.db.find_by_symbol(symbol, self.collection_name)
        if self.check_value_update():
            print("Updating Currency: " + symbol)
            currency["value"] = self.get_currency_value(currency)
            update_data = {
                "value": currency["value"],
                "updated_at": currency["updated_at"]
            }
            self.update(currency['_id'], update_data)
        
        return currency

    def update(self, id, currency):
        self.validator.validate(currency, self.fields, self.update_required_fields, self.update_optional_fields)
        return self.db.update(id, currency, self.collection_name)

    def delete(self, symbol):
        return self.db.delete_by_symbol(symbol, self.collection_name)
    
    def get_currency_value(self, currency):
        response = requests.get("https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=" + currency["symbol"])

        if response.status_code == 200:
            return json.loads(response.text)[currency["symbol"]]
        else:
            return None

    def check_value_update(self):

        need_update = False

        with open('mock_data.json', 'r+') as json_file:
            mock_file = json.load(json_file)

            try:
                if 'last_update' not in mock_file:
                    need_update = True
                elif not mock_file['last_update']:
                    need_update = True
                elif datetime.strptime(mock_file['last_update'], '%Y-%m-%d').date() < date.today():
                    need_update = True
            except:
                need_update = True

        if need_update:
            mock_file['last_update'] = date.today().strftime('%Y-%m-%d')
            with open('mock_data.json', 'w') as json_file:
                json.dump(mock_file, json_file)
        
        return need_update
