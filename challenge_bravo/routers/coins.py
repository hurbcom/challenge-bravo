from fastapi import APIRouter
from fastapi import status
from typing import List
from peewee import DoesNotExist

from challenge_bravo.errors import ObjectDoesNotExist
from challenge_bravo.models import Coin
from challenge_bravo.models import CoinModel


router = APIRouter()


@router.post('/', status_code=status.HTTP_201_CREATED)
def create_coin(coin: Coin) -> Coin:
    """ Coin creation endpoint. """

    coin = CoinModel.create(**coin.dict())
    return coin.get_as_coin_type()


@router.get('/')
def list_coins() -> List[Coin]:
    """ Coin list endpoint. """

    return [coin.get_as_coin_type() for coin in CoinModel.select()]


@router.get('/{id_coin}')
def retrieve_coin(id_coin: int) -> Coin:
    """ Coin retrieve endpoint. """

    try:
        coin_object = CoinModel.get(CoinModel.id == id_coin)
        return coin_object.get_as_coin_type()
    except DoesNotExist:
        raise ObjectDoesNotExist()


@router.patch('/{id_coin}')
def update_coin(id_coin: int, coin: Coin) -> Coin:
    """ Coin update endpoint """

    try:
        coin_object = CoinModel.get(CoinModel.id == id_coin)
        coin_object.name = coin.name
        coin_object.code = coin.code
        coin_object.price = coin.price
        coin_object.save()
        return coin_object.get_as_coin_type()
    except DoesNotExist:
        raise ObjectDoesNotExist()


@router.delete('/{id_coin}', status_code=status.HTTP_204_NO_CONTENT)
def delete_coin(id_coin: int):
    """ Coin deletion endpoint """

    try:
        coin_object = CoinModel.get(CoinModel.id == id_coin)
        coin_object.delete_instance()
    except DoesNotExist:
        raise ObjectDoesNotExist()
