import pytest
from pymongo import MongoClient

from src.common.config import mongodb_uri, database


@pytest.fixture(scope="function")
def fixture_mongo():
    client = MongoClient(mongodb_uri)
    db = client[database]

    yield db

    client.drop_database(database)
    client.close()
