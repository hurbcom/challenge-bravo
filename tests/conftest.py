import sys

from environs import Env

Env().read_env()

import os
from typing import Callable

import flask_migrate as fm
from colorama import Fore
from faker import Faker
from pytest import fixture

from app import create_app
from app.classes.app_with_db import AppWithDb


def remove_dir(path):
    if os.path.exists(os.path.abspath(path)):
        from shutil import rmtree

        rmtree(os.path.abspath(path))


@fixture
def app():
    """Cria e configura uma nova aplicação para cada teste usando um banco de
    teste temporário aplciando as migrações. Após cada teste, deleta o banco"""
    os.environ["FLASK_ENV"] = "test"

    app = create_app()

    db_path = os.getenv("DB_TEST_PATH", "db_test.sqlite3")

    with app.app_context():
        mg_path = "tests/migrations"

        remove_dir(mg_path)

        fm.init(mg_path)
        fm.migrate(mg_path)
        fm.upgrade(mg_path)

    yield app

    os.remove(f"app/{db_path}")


@fixture
def client(app: AppWithDb):
    """Um client Test da aplicação"""
    return app.test_client()


@fixture
def colorized() -> Callable[[str], str]:
    """Retorna uma função anônima que adiciona informações de cor a uma\n
    string para melhor visualização no terminal. Retorna a seguinte função::

        colorized(msg: str) -> str

    Exemplo::

        def test_if_get_route_returns_correct_status_code(colorized):

            resp = requests.get(...)

            err_msg = "Status code errado!"

            assert resp.status_code == 200, colorized(err_msg)"""
    return lambda msg: f"{Fore.CYAN}{msg}{Fore.RESET}"


@fixture
def fake() -> Faker:
    """Retorna uma instância do objeto `faker.Faker`

    Exemplo::

        def test_if_create_route_returns_correct_status_code(fake):
            payload = {
                "name": fake.name(),
                "email": fake.email(),
                "password": fake.password(),
                "description": fake.text(),
            }

            resp = post("/users", payload)

            err_msg = "Status code errado!"

            assert resp.status_code == 201, err_msg"""
    return Faker()
