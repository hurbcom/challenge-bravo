from challenge_bravo.utils.config import Config
from challenge_bravo.utils.container import Container
from challenge_bravo.utils.conversion import Conversion
from challenge_bravo.repositories.exchange_rate_api import ExchangeRateApi
from challenge_bravo.repositories.mongodb import Mongodb


def get_container():
    container = Container()
    container.add('mongodb', Mongodb(Config))
    container.add('exchange_rate_api', ExchangeRateApi(Config))
    container.add('conversion', Conversion())
    return container
