from main.common.database import DBClient
from main.model.currency import Currency as CurrencyModel
from main.repository import RopositoryBase
from main.model.exchange import ExchangeSource as ExchangeSourceModel
from main.model.rate import Rate as RateModel
import bson

class Rate(RopositoryBase):

    collection = "exchanges_rates2"

    # def find(self, query):
    #     documents = super(Rate, self).find(self, query)
    #     return documents

    def find(self, query):
        mongo_currencies_collection = self.get_collection()
        documents = mongo_currencies_collection.find(query)
        output = list(documents)
        return output


    def create(self, data):
        mongo_collection = self.get_collection()

        insert_result = mongo_collection.insert_one(data)

        if not insert_result.acknowledged:
            raise Exception('Error on inserting rate')

        data['_id'] = insert_result.inserted_id

        object = RateModel().load(data)

        return object

    def update(self, id, data):
        query = {"_id": id}
        nvalue = { "$set": data }

        mongo_collection = self.get_collection()
        updated = mongo_collection.update_one(query, nvalue)

        return updated

    def delete_many(self, filter):
        mongo_collection = self.get_collection()
        result = mongo_collection.delete_many(filter)
        return result
