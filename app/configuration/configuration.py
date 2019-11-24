from helper.singleton import Singleton
import os


class Configuration(metaclass=Singleton):
    def __init__(self):
        self.cache_timeout = int(os.environ["CACHE_TIMOUT_INT_SECONDS"])
        self.exchange_rates_url = os.environ["EXCHANGE_RATES_URL"]
        self.coin_cap_url = os.environ["COIN_CAP_URL"]
