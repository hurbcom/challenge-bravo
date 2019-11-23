from copy import deepcopy
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

    # TODO: destination deve ser um model USD
    def converter(self, base: CurrencyModel, amount: float, destination=BALLAST):
        self._load_cache()

        values = VALUE_CACHE["values"]
        base_value = values[base.code]
        destination_value = values[destination.code]

        destination_amout = amount * destination_value / base_value
        return destination_amout

    def _load_cache(self):
        # TODO migrar info para variável de ambiente. Se quiser que a
        # recarregue a todo momento e ou esteja realtime com os serviços,
        # basta usar timeout = 0
        expiration_cache_in_seconds = 30
        timeout = expiration_cache_in_seconds

        if datetime.utcnow() - VALUE_CACHE["last_update"] < timedelta(seconds=timeout):
            return

        params = {"base": BALLAST.code}
        response = self._request_to_exchange_api(params=params)

        if not response.ok:
            # TODO: escrever uma tratativa melhor
            return False, response.text

        # TODO: deep ou shallow?
        VALUE_CACHE["values"] = deepcopy(response.json()["rates"])
        VALUE_CACHE["last_update"] = datetime.utcnow()

    def _build_available_currencies(self):
        if not AVAILABLE_CURRENCIES_CODES:
            response = self._request_to_exchange_api()
            currencies_from_api = response.json()["rates"].keys()
            AVAILABLE_CURRENCIES_CODES.extend(currencies_from_api)

    def _request_to_exchange_api(self, day="latest", method="GET", params={}):
        url = f"https://api.exchangeratesapi.io/{day}"
        try:
            return requests.request(method=method, url=url, params=params)
        except Exception as ex:
            # TODO: tratar como? raise? Munch lib?
            return ex

    # TODO: static mesmo? A classe precisa ter sido instanciada uma vez de qualquer forma para carregar o repo.
    # resolver este méthodo: não quer garantir que a classe tenha sido instanciada para o repo ter sido carregado.
    @staticmethod
    def is_currency_available(currency):
        for code in AVAILABLE_CURRENCIES_CODES:
            if code == currency.code:
                return True

        return False
