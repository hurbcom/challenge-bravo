import logging

from pymongo import MongoClient
from pymongo.database import Database

from app.exceptions.default_exceptions import MongoRepositoryTransactionsException
from app.utils.config import return_default_settings

logger = logging.getLogger(__name__)
settings = return_default_settings()
MAX_MONGO_TIMEOUT = 5000


class MongoRepository:
    def __init__(self, server_timeout: int = MAX_MONGO_TIMEOUT) -> None:
        self.CONNECTION_STRING = (
            f"mongodb://{settings.MONGO_USER}:"
            f"{settings.MONGO_PASSWORD}@localhost:"
            f"{settings.MONGO_PORT}"
            "/admin?authSource=admin&authMechanism=SCRAM-SHA-1"
        )
        # Create a connection using MongoClient.
        self.client = MongoClient(
            self.CONNECTION_STRING, serverSelectionTimeoutMS=server_timeout
        )

    def _get_database(self, db_name: str) -> Database:
        return self.client[db_name]

    def get_by_id(self, db_name: str, collection: str, id: str) -> dict:
        try:
            db = self._get_database(db_name)
            response = db[collection].find_one({"id": id})
        except Exception as error:
            logger.error(
                f"DB retornou erro - GetById | Erro: {error}", extra={"error": error}
            )
            raise MongoRepositoryTransactionsException()
        return response

    def get_by_acronym(self, db_name: str, collection: str, acronym: str) -> dict:
        try:
            db = self._get_database(db_name)
            response = db[collection].find_one({"acronym": acronym})
        except Exception as error:
            logger.error(
                f"DB retornou erro - GetByAcr | Erro: {error}", extra={"error": error}
            )
            raise MongoRepositoryTransactionsException()
        return response

    def get_all_currency(self, db_name: str, collection: str) -> list:
        try:
            db = self._get_database(db_name)
            cursor = db[collection].find({})
            store_cursor = []
            for document in cursor:
                store_cursor.append(document)
        except Exception as error:
            logger.error(
                f"DB retornou erro - GetByAcr | Erro: {error}", extra={"error": error}
            )
            raise MongoRepositoryTransactionsException()
        return store_cursor

    def get_cached_date(self, db_name: str, collection: str) -> dict:
        try:
            db = self._get_database(db_name)
            response = db[collection].find_one({"daily_time": True})
        except Exception as error:
            logger.error(
                f"DB retornou erro - GetById | Erro: {error}", extra={"error": error}
            )
            raise MongoRepositoryTransactionsException()
        return response

    def create(self, db_name: str, collection: str, data: dict):
        try:
            db = self._get_database(db_name)
            db[collection].insert_one(data)
        except Exception as error:
            logger.error(
                f"DB retornou erro - Create | Erro: {error}", extra={"error": error}
            )
            raise MongoRepositoryTransactionsException()

    def delete_by_id(self, db_name: str, collection: str, id: str) -> dict:
        try:
            db = self._get_database(db_name)
            response = db[collection].delete_one({"id": id})
        except Exception as error:
            logger.error(
                f"DB retornou erro - DelById | Erro: {error}", extra={"error": error}
            )
            raise MongoRepositoryTransactionsException()
        return response

    def delete_by_acronym(self, db_name: str, collection: str, acronym: str) -> dict:
        try:
            db = self._get_database(db_name)
            response = db[collection].delete_one({"acronym": acronym})
        except Exception as error:
            logger.error(
                f"DB retornou erro - DelByAcr | Erro: {error}", extra={"error": error}
            )
            raise MongoRepositoryTransactionsException()
        return response

    def update_by_id(self, db_name: str, collection: str, id: str, data: dict) -> dict:
        try:
            db = self._get_database(db_name)
            response = db[collection].update_one(filter={"id": id}, update=data)
        except Exception as error:
            logger.error(
                f"DB retornou erro - UpdtById | Erro: {error}", extra={"error": error}
            )
            raise MongoRepositoryTransactionsException()
        return response

    def update_or_create_by_acronym(
        self, db_name: str, collection: str, acronym: str, data: dict
    ) -> dict:
        try:
            db = self._get_database(db_name)
            response = db[collection].replace_one(
                filter={"acronym": acronym}, replacement=data, upsert=True
            )
        except Exception as error:
            logger.error(
                f"DB retornou erro - UpdtByAcr | Erro: {error}", extra={"error": error}
            )
            raise MongoRepositoryTransactionsException()
        return response

    def update_or_create_date_cache(
        self, db_name: str, collection: str, data: dict
    ) -> dict:
        try:
            db = self._get_database(db_name)
            response = db[collection].replace_one(
                filter={"daily_time": True}, replacement=data, upsert=True
            )
        except Exception as error:
            logger.error(
                f"DB retornou erro - UpdtByAcr | Erro: {error}", extra={"error": error}
            )
            raise MongoRepositoryTransactionsException()
        return response
