import json

from challenge_bravo.settings import FIXTURES_FOLDER

from .models import CoinModel


def create_database_default_coins() -> None:
    """ Creates the default coins in the database """
    fixtures_path = FIXTURES_FOLDER + 'coin_fixture.json'
    with open(fixtures_path, 'r') as file_handler:
        fixture = file_handler.read()
        initial_coins = json.loads(fixture)

    for coin in initial_coins:
        coin_model_select =\
            CoinModel.select().where(CoinModel.code == coin['code'])
        if not coin_model_select:
            CoinModel.create(**coin)
