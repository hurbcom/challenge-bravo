import requests

AVAILABLE_CURRENCIES = dict()


# TODO: https://docs.coincap.io/?version=latest documentation
class CoinCapService:
    def __init__(self):
        self.get_available_currencies()

    def asset(self, crypto_currency, amount):
        endpoint = f"assets/{AVAILABLE_CURRENCIES[crypto_currency]}"
        response = self._request_to_api(endpoint)

        if not response.ok:
            # TODO: escrever uma tratativa melhor
            return response.text

        data = response.json()["data"]
        destination_value = float(data["priceUsd"])

        destination_amout = amount * destination_value
        return destination_amout

    def get_available_currencies(self):
        if not AVAILABLE_CURRENCIES:
            response = self._request_to_api("assets/")
            data = response.json()["data"]
            currencies_from_api = {
                c["symbol"]: c["name"].lower() for c in data
            }
            AVAILABLE_CURRENCIES.update(currencies_from_api)

        return AVAILABLE_CURRENCIES.keys()

    def _request_to_api(self, endpoint, method="GET"):
        url = f"http://api.coincap.io/v2/{endpoint}"
        try:
            return requests.request(method=method, url=url)
        except Exception as ex:
            # TODO: tratar como? raise? Munch lib?
            return ex
