import requests


class ExternalApiConnector:

    BASE_URL = "https://min-api.cryptocompare.com/data/pricemulti?"

    def get_quotation(self, currency_from, currency_to):

        url = '{0}fsyms={1}&tsyms={2}'.format(ExternalApiConnector.BASE_URL, currency_from, currency_to)

        response = requests.get(
            url
        )

        return response.json()



