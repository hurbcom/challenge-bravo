import requests

from challenge_bravo.domain.exchange_rate_response import ExchangeRateResponse


class ExchangeRateApi:

    def __init__(self, config):
        self.base_url = config.EXCHANGE_API_URL

    def convert_currencies(self, origin):
        try:
            convert_response = requests.get(f'{self.base_url}?from={origin}&to=USD')
            response_body = convert_response.json()
            status = convert_response.status_code
            if status == 200:
                exchange_rate_response = ExchangeRateResponse(
                    success=response_body['success'],
                    rate=response_body['info']['rate'] if response_body['info']['rate'] is not None else 0,
                    date=response_body['date'],
                    result=response_body['result'] if response_body['result'] is not None else 0,
                    origin_currency=response_body['query']['from'],
                    destiny_currency=response_body['query']['to'],
                    amount=response_body['query']['amount']
                ).validate()
                return exchange_rate_response
        except requests.RequestException:
            raise requests.RequestException
