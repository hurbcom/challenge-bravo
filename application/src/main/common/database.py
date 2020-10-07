from flask_restful import Resource
from pymongo import MongoClient
from main.app import logger

class DBClient(Resource):
    db_name = 'bravo'

    @staticmethod
    def client():
        client = MongoClient("mongo:27017")
        return client

    @staticmethod
    def conn():
        client = DBClient.client()
        dbnames = client.list_database_names()
        if DBClient.db_name not in dbnames:
            mongodb = client[DBClient.db_name]
            logger.info ("Database created")
        else:
            mongodb = client[DBClient.db_name]

        return mongodb
