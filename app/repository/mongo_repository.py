from pymongo import MongoClient
from pymongo.database import Database

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
        db = self._get_database(db_name)
        return db[collection].find_one({"id": id})

    def get_by_acronym(self, db_name: str, collection: str, acronym: str) -> dict:
        db = self._get_database(db_name)
        return db[collection].find_one({"acronym": acronym})

    def create(self, db_name: str, collection: str, data: str) -> dict:
        db = self._get_database(db_name)
        try:
            db[collection].insert_one(data)
        except Exception:
            raise ValueError

    def delete_by_id(self, db_name: str, collection: str, id: str) -> dict:
        db = self._get_database(db_name)
        return db[collection].remove({"id": id})

    def delete_by_acronym(self, db_name: str, collection: str, acronym: str) -> dict:
        db = self._get_database(db_name)
        return db[collection].remove({"acronym": acronym})

    def update(self):
        ...
