from configuration.configuration import Configuration
from copy import copy
from datetime import datetime, timedelta
from helper.request import http_request
from models.currency import CurrencyModel
from repository.currency_repository import CurrencyRepository, BALLAST_CURRENCY

AVAILABLE_CURRENCIES_CODES = list()
VALUE_CACHE = {"values": dict(), "last_update": datetime.min}
BALLAST = CurrencyRepository().get_currency_by_code(BALLAST_CURRENCY[0])


class ExchangeRatesService:
    def __init__(self):
        self._exchange_base_url = Configuration().exchange_rates_url

    def converter(self, base: CurrencyModel,
                  amount: float, destination=BALLAST):
        self._load_cache()
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
        response = http_request(self._exchange_base_url, "latest/", params)

        VALUE_CACHE["values"] = copy(response.json()["rates"])
        VALUE_CACHE["last_update"] = datetime.utcnow()

    def is_currency_available(self, currency):
        self._build_available_currencies()
        for code in AVAILABLE_CURRENCIES_CODES:
            if code == currency.code:
                return True

        return False

    def _build_available_currencies(self):
        if not AVAILABLE_CURRENCIES_CODES:
            response = http_request(self._exchange_base_url, "latest/")
            currencies_from_api = response.json()["rates"].keys()
            AVAILABLE_CURRENCIES_CODES.extend(currencies_from_api)
