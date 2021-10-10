import os
from json import loads
from src.coins.Coins import Coins
from json import loads


def insert_default_coins(app):
    with app.app_context():
        has_coins = len(loads(Coins().list({}).data)) > 0
        if has_coins == False:
            print('Registering default coins')
            path = os.path.abspath('src/utils/default_coins/coins.json')
            arq = open(path,'r')
            data = loads(arq.read())
            for item in data:
                Coins().insert(item)
        else:
            print('Coins already registered')