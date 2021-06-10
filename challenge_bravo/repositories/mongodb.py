from pymongo import MongoClient
from pymongo.errors import WriteError

from challenge_bravo.exceptions.mongo_exceptions import NoMatchedCurrency
from challenge_bravo.interfaces.repository import Repository


class Mongodb(Repository):

    def __init__(self, config):
        self.db = MongoClient(self.generate_mongo_connection_string(config))[f'{config.MONGODB_DATABASE}']

    def add_to_collection(self, payload):
        return self.db.currencies.insert(payload)

    def remove_from_collection(self, query):
        return self.db.currencies.delete_many(query)

    def get_from_collection(self, code=None):
        try:
            if code is None:
                return self.db.currencies.find({}, {'_id': False})
            return self.db.currencies.find_one({'code': code})
        except Exception as e:
            print(e)

    @staticmethod
    def generate_mongo_connection_string(config):
        return f'mongodb://{config.MONGODB_USERNAME}:{config.MONGODB_PASSWORD}' \
               f'@{config.MONGODB_HOST}:{config.MONGODB_PORT}/'

    def update_object(self, currency_id, updated_fields):
        if 'code' in updated_fields.keys():
            raise WriteError("You cant update currency code")
        result = self.db.currencies.update_one({
            'code': currency_id
        }, {
            '$set': updated_fields
        }, upsert=False)
        if result.matched_count == 1:
            return result
        else:
            raise NoMatchedCurrency(f'Unable to find currency code {currency_id}')
