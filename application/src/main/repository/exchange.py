from main.common.database import DBClient
from main.model.currency import Currency as CurrencyModel
from main.repository import RopositoryBase
from main.model.exchange import ExchangeSource as ExchangeSourceModel
from main.model.exchange import ExchangeRate as ExchangeRateModel
import bson

class ExchangeRate(RopositoryBase):

    collection = "exchanges_rates"

    def find(self, query):
        documents = super(ExchangeRate, self).find(self, query)
        return documents

    def create(self, data):
        mongo_collection = self.get_collection()

        insert_result = mongo_collection.insert_one(data)

        if not insert_result.acknowledged:
            raise Exception('Error on inserting rate')

        data['_id'] = insert_result.inserted_id

        object = ExchangeRateModel().load(data)

        return object


class ExchangeSource(RopositoryBase):

    collection = "exchanges_sources"

    def find(self, query):
        documents = super(ExchangeSource, self).find(self, query)
        return documents

    def create(self, data):
        exchange_source = self.find({"source":data['source'],"base":data['base']})
        if exchange_source.count(True):
            object = ExchangeSourceModel().load(exchange_source[0])
            return object

        mongo_collection = self.get_collection()

        insert_result = mongo_collection.insert_one(data)

        if not insert_result.acknowledged:
            raise Exception('Error on inserting source')

        data['_id'] = insert_result.inserted_id

        object = ExchangeSourceModel().load(data)

        return object

    def hydrate_rates(self, object):
        object['rates'] = {}
        rates_documents = ExchangeRate().find({'source_id':bson.ObjectId(object['_id']).__str__()})
        if rates_documents.count(True):
            for i in rates_documents:
                object['rates'][i['currency']] = i['value']
        return object