import pytest
from desafio.app import create_app
from desafio.commands import init_db
from desafio.settings import TestConfig


@pytest.fixture(scope="session")
def app():
    app = create_app(TestConfig)

    with app.app_context():
        init_db()

    app.app_context().push()

    yield app


@pytest.fixture(scope="session")
def client(app):
    return app.test_client()


@pytest.fixture(scope="session")
def runner(app):
    return app.test_cli_runner()
