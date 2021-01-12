import pytest
from pymongo import MongoClient

from src.common.config import mongodb_uri


@pytest.fixture(scope="function")
def fixture_mongo():
    client = MongoClient(mongodb_uri)
    database = "bravo-test"
    db = client[database]

    yield db

    client.drop_database(database)
    client.close()
