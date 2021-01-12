import pytest

from src.main import app


@pytest.fixture(scope="function")
def fixture_client():
    app.config["TESTING"] = True
    client = app.test_client()

    yield client
