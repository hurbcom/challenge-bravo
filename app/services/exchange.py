import requests

AVAILABLE_CURRENCIES = list()


class ExchangeService:
    def __init__(self):
        self._ballast = 'USD'

    def converter(self, base, destination, amount):
        params = {"base": self._ballast}
        response = self._request_to_exchange_api(params=params)

        if not response.ok:
            # TODO: escrever uma tratativa melhor
            return response.text

        values = response.json()["rates"]
        base_value = values[base]
        destination_value = values[destination]

        destination_amout = amount * destination_value / base_value
        return destination_amout

    def get_available_currencies(self):
        if not AVAILABLE_CURRENCIES:
            response = self._request_to_exchange_api()
            currencies_from_api = response.json()["rates"].keys()
            AVAILABLE_CURRENCIES.extend(currencies_from_api)

        return AVAILABLE_CURRENCIES

    def _request_to_exchange_api(self, day="latest", method="GET", params={}):
        url = f"https://api.exchangeratesapi.io/{day}"
        return requests.request(method=method, url=url, params=params)
