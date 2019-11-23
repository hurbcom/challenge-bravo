from datetime import datetime, timedelta
from models.currency import CurrencyModel
import requests

AVAILABLE_CURRENCIES_CODES = dict()
VALUE_CACHE = {"values": dict(), "last_update": datetime.min}


# TODO: https://docs.coincap.io/?version=latest documentation
class CoinCapService:
    def __init__(self):
        self._build_available_currencies()

    def asset(self, crypto_currency: CurrencyModel, amount: float):
        destination_amout = amount * VALUE_CACHE[crypto_currency.code]
        return destination_amout

    def _load_cache(self):
        # TODO migrar info para variável de ambiente. Se quiser que a
        # recarregue a todo momento e ou esteja realtime com os serviços,
        # basta usar timeout = 0
        expiration_cache_in_seconds = 30
        timeout = expiration_cache_in_seconds

        if datetime.utcnow() - VALUE_CACHE["last_update"] < timedelta(seconds=timeout):
            return

        response = self._request_to_api("assets/")

        if not response.ok:
            # TODO: escrever uma tratativa melhor
            return False, response.text

        currencies = response.json()["data"]

        VALUE_CACHE["values"] = {
            c["symbol"]: float(c["priceUsd"]) for c in currencies
        }
        VALUE_CACHE["last_update"] = datetime.utcnow()

    def _build_available_currencies(self):
        if not AVAILABLE_CURRENCIES_CODES:
            response = self._request_to_api("assets/")
            # TODO: if not response.ok ?
            currencies = response.json()["data"]
            currencies_from_api = {
                c["symbol"]: c["name"].lower() for c in currencies
            }
            AVAILABLE_CURRENCIES_CODES.update(currencies_from_api)

    def _request_to_api(self, endpoint, method="GET"):
        url = f"http://api.coincap.io/v2/{endpoint}"
        try:
            return requests.request(method=method, url=url)
        except Exception as ex:
            # TODO: tratar como? raise? Munch lib?
            return ex

    # TODO: static mesmo? A classe precisa ter sido instanciada uma vez de qualquer forma para carregar o repo.
    @staticmethod
    def is_currency_available(currency):
        for code in AVAILABLE_CURRENCIES_CODES.keys():
            if code == currency.code:
                return True

        return False
