from pymongo import MongoClient
from pymongo.database import Database

from app.exceptions.default_exceptions import MongoRepositoryTransactionsException
from app.utils.config import return_default_settings

settings = return_default_settings()


class MongoRepository:
    def __init__(self) -> None:
        self.CONNECTION_STRING = (
            f"mongodb://{settings.MONGO_USER}:"
            f"{settings.MONGO_PASSWORD}@localhost:"
            f"{settings.MONGO_PORT}"
            "/admin?authSource=admin&authMechanism=SCRAM-SHA-1"
        )
        # Create a connection using MongoClient.
        self.client = MongoClient(self.CONNECTION_STRING)

    def _get_database(self, db_name: str) -> Database:
        return self.client[db_name]

    def get_by_id(self, db_name: str, collection: str, id: str) -> dict:
        try:
            db = self._get_database(db_name)
            response = db[collection].find_one({"id": id})
        except Exception as error:
            raise MongoRepositoryTransactionsException()
        return response

    def get_by_acronym(self, db_name: str, collection: str, acronym: str) -> dict:
        try:
            db = self._get_database(db_name)
            response = db[collection].find_one({"acronym": acronym})
        except Exception as error:
            raise MongoRepositoryTransactionsException()
        return response

    def create(self, db_name: str, collection: str, data: str) -> dict:
        db = self._get_database(db_name)
        try:
            db[collection].insert_one(data)
        except Exception as error:
            raise MongoRepositoryTransactionsException()

    def delete_by_id(self, db_name: str, collection: str, id: str) -> dict:
        try:
            db = self._get_database(db_name)
            response = db[collection].delete_one({"id": id})
        except Exception as error:
            raise MongoRepositoryTransactionsException()
        return response

    def delete_by_acronym(self, db_name: str, collection: str, acronym: str) -> dict:
        try:
            db = self._get_database(db_name)
            response = db[collection].delete_one({"acronym": acronym})
        except Exception as error:
            raise MongoRepositoryTransactionsException()
        return response

    def update_by_id(self, db_name: str, collection: str, id: str, data: dict) -> dict:
        try:
            db = self._get_database(db_name)
            response = db[collection].update_one(filter={"id": id}, update=data)
        except Exception as error:
            raise MongoRepositoryTransactionsException()
        return response

    def update_by_acronym(
        self, db_name: str, collection: str, acronym: str, data: dict
    ) -> dict:
        try:
            db = self._get_database(db_name)
            response = db[collection].update_one(
                filter={"acronym": acronym}, update=data
            )
        except Exception as error:
            raise MongoRepositoryTransactionsException()
        return response
