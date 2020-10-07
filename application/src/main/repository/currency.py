from main.common.database import DBClient
from main.model.currency import Currency as CurrencyModel

class Currency():

    collection = "currencies"

    @staticmethod
    def get_collection():
        mongodb = DBClient.conn()
        return mongodb[Currency.collection]


    @staticmethod
    def find(query):
        mongo_currencies_collection = Currency.get_collection()
        documents = mongo_currencies_collection.find(query)
        output = []

        if documents:
            for doc in documents:
                output.append(CurrencyModel().load(doc))

        return output


    @staticmethod
    def create(data):
        mongo_currencies_collection = Currency.get_collection()

        insert_result = mongo_currencies_collection.insert_one(data)

        if not insert_result.acknowledged:
            raise Exception('Error on inserting currency')

        data['_id'] = insert_result.inserted_id

        object = CurrencyModel().load(data)

        return object
