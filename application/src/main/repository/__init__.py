from main.common.database import DBClient

class RopositoryBase():

    collection = "exchanges"

    def get_collection(self):
        mongodb = DBClient.conn()
        return mongodb[self.collection]

    @staticmethod
    def find(self, query):
        mongo_currencies_collection = self.get_collection()
        documents = mongo_currencies_collection.find(query)
        output = list(documents)
        return output


