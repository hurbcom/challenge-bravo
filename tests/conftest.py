import pytest
from pytest_mock_resources import create_mongo_fixture
from app import create_app

mongo = create_mongo_fixture()

@pytest.fixture
def app(mongo):
    app = create_app(mongo)
    return app


@pytest.fixture
def app_context(app):
    with app.app_context() as ctx:
        yield ctx


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()

