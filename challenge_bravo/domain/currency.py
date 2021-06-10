from schema import Schema, SchemaError, Use, And, Optional
from datetime import datetime
import logging
from challenge_bravo.repositories.mongodb import Mongodb
from challenge_bravo.interfaces.domain import Domain


class Currency(Domain):
    code: str
    currency_name: str
    currency_value_in_usd: float
    currency_id: str
    created_at: datetime = datetime.now().strftime('%d %B %Y, %H:%M:%S')

    def __init__(self, mongo: Mongodb, **kwargs):
        self.code = kwargs.get('code')
        self.currency_name = kwargs.get('currency_name')
        self.currency_value_in_usd = kwargs.get('currency_value_in_usd')
        self.currency_id = kwargs.get('currency_id')
        self.mongo = mongo

    def check_currency_already_exists(self, code):
        result = self.mongo.get_from_collection(code)
        return result is not None

    def validate(self, *args, **kwargs):
        try:
            item = self.validation_schema.validate(self.to_item())
            return Currency(self.mongo, **item)
        except SchemaError:
            raise SchemaError('Error while validating data or code already exists')

    def to_item(self, *args, **kwargs):
        return {
            'code': self.code,
            'currency_name': self.currency_name,
            'created_at': self.created_at,
            'currency_value_in_usd': self.currency_value_in_usd,
        }

    def add_item(self):
        return self.mongo.add_to_collection(self.to_item())

    def get_items(self):
        return self.mongo.get_from_collection()

    def update_object(self, currency_id):
        payload = self.to_item()
        filtered_payload = self.sanitize(payload)
        return self.mongo.update_object(currency_id, filtered_payload)

    def delete_object(self):
        filtered_payload = self.sanitize(self.to_item())
        return self.mongo.remove_from_collection(filtered_payload)

    def sanitize(self, payload):
        filtered_payload = {}
        for key, val in self.to_item().items():
            if val != 'None' and key in vars(self):
                filtered_payload[key] = val
        return filtered_payload

    @property
    def validation_schema(self, *args, **kwargs):
        return Schema({
            Optional('code'): And(Use(str), lambda x: not self.check_currency_already_exists(x)),
            Optional('currency_name'): Use(str),
            Optional('created_at'): Use(str),
            Optional('currency_id'): Use(str),
            Optional('currency_value_in_usd'): And()
        })
