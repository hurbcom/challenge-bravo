from configuration.configuration import Configuration
from copy import copy
from datetime import datetime, timedelta
from models.currency import CurrencyModel
from repository.currency_repository import CurrencyRepository
import requests

AVAILABLE_CURRENCIES_CODES = list()
VALUE_CACHE = {"values": dict(), "last_update": datetime.min}
BALLAST = CurrencyRepository().get_currency_by_code('USD')


class ExchangeRatesService:
    def __init__(self):
        self._build_available_currencies()
        self._load_cache()

    def converter(self, base: CurrencyModel,
                  amount: float, destination=BALLAST):
        values = VALUE_CACHE["values"]
        base_value = values[base.code]
        destination_value = values[destination.code]

        destination_amout = amount * destination_value / base_value
        return destination_amout

    def _load_cache(self):
        last_update = datetime.utcnow() - VALUE_CACHE["last_update"]
        if last_update < timedelta(Configuration().cache_timeout):
            return

        params = {"base": BALLAST.code}
        response = self._request_to_exchange_api(params=params)

        VALUE_CACHE["values"] = copy(response.json()["rates"])
        VALUE_CACHE["last_update"] = datetime.utcnow()

    def _build_available_currencies(self):
        if not AVAILABLE_CURRENCIES_CODES:
            response = self._request_to_exchange_api()
            currencies_from_api = response.json()["rates"].keys()
            AVAILABLE_CURRENCIES_CODES.extend(currencies_from_api)

    def _request_to_exchange_api(self, day="latest", method="GET", params={}):
        try:
            response = requests.request(
                method=method,
                url=f"{Configuration().exchange_rates_url}{day}",
                params=params
            )
            if not response.ok:
                raise Exception(response.text)
            return response
        except Exception as ex:
            raise ex

    def is_currency_available(self, currency):
        for code in AVAILABLE_CURRENCIES_CODES:
            if code == currency.code:
                return True

        return False
