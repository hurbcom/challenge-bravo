import requests

from api.app import app, cache

ONE_HOUR = 3600


class ExchangeAPI(object):

    def __init__(self, openexchange_id, coinlayer_access_key):
        self.openexchange_id = openexchange_id
        self.coinlayer_access_key = coinlayer_access_key

    @cache.memoize(ONE_HOUR)
    def get_currency_rate(self, currency):
        rates = self._get_rates_from_api()
        return rates.get(currency)

    def get_currencies_rate(self):
        return self._get_rates_from_api()

    @cache.memoize(ONE_HOUR)
    def _get_rates_from_api(self):
        rates = self._get_rates_from_blockchains()
        rates.update(self._get_rates_from_real_currencies())

        return rates

    def _get_rates_from_real_currencies(self):
        url = 'https://openexchangerates.org/api/latest.json'
        params = {
            'app_id': self.openexchange_id,
            'base': 'USD'
        }

        return self._get_rates_from(url, params, 'openexchange')

    def _get_rates_from_blockchains(self):
        url = 'http://api.coinlayer.com/live'
        params = {
            'access_key': self.coinlayer_access_key
        }

        rates = self._get_rates_from(url, params, 'coinlayer')
        return {key: 1 / value for key, value in rates.items() if value}

    def _get_rates_from(self, url, params, api):
        response = requests.get(url, params=params)

        if response.status_code == 200:
            data = response.json()
            return data.get('rates', {})

        app.logger.error(F'ExchangeAPI: Error on access API {api} (Status code: {response.status_code}).')
        return {}

    def __repr__(self):
        return 'ExchangeAPI'