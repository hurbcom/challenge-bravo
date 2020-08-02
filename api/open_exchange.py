import requests

from api.app import app

class OpenExchange(object):

    def __init__(self, app_id):
        self.app_id = app_id

    def get_currency_rate(self, currency):
        rates = self._get_rates_from_api()
        return rates.get(currency)

    def get_currencies_rate(self):
        return self._get_rates_from_api()

    def _get_rates_from_api(self):
        latest_url = 'https://openexchangerates.org/api/latest.json'
        url = F'{latest_url}?app_id={self.app_id}&base=USD'

        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            return data.get('rates', {})

        app.logger.error(F'OpenExchange: Error on access API (Status code: {response.status_code}).')
        return {}