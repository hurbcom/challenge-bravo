from configuration.configuration import Configuration
from datetime import datetime, timedelta
from models.currency import CurrencyModel
import requests

AVAILABLE_CURRENCIES_CODES = dict()
VALUE_CACHE = {"values": dict(), "last_update": datetime.min}


class CoinCapService:
    def __init__(self):
        self._build_available_currencies()
        self._load_cache()

    def converter(self, crypto_currency: CurrencyModel, amount: float):
        value = VALUE_CACHE["values"][crypto_currency.code]
        return amount * value

    def _load_cache(self):
        last_update = datetime.utcnow() - VALUE_CACHE["last_update"]

        if last_update < timedelta(seconds=Configuration().cache_timeout):
            return

        response = self._request_to_api()

        currencies = response.json()["data"]

        VALUE_CACHE["values"] = {
            c["symbol"]: float(c["priceUsd"]) for c in currencies
        }
        VALUE_CACHE["last_update"] = datetime.utcnow()

    def _build_available_currencies(self):
        if AVAILABLE_CURRENCIES_CODES:
            return

        response = self._request_to_api()
        currencies = response.json()["data"]
        currencies_from_api = {
            c["symbol"]: c["name"].lower() for c in currencies
        }
        AVAILABLE_CURRENCIES_CODES.update(currencies_from_api)

    def _request_to_api(self, endpoint="assets/", method="GET"):
        try:
            response = requests.request(
                method=method,
                url=f"{Configuration().coin_cap_url}{endpoint}"
            )

            if not response.ok:
                raise Exception(response.text)
            return response
        except Exception as ex:
            raise ex

    def is_currency_available(self, currency):
        CoinCapService()._build_available_currencies()
        for code in AVAILABLE_CURRENCIES_CODES.keys():
            if code == currency.code:
                return True

        return False
