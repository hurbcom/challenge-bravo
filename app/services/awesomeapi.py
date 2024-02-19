from fastapi import status
from httpx import Response

from app.utils.http_client import return_client_http

BASE_URL = "https://economia.awesomeapi.com.br"


class AwesomeApiService:
    def _execute(
        self, url: str, method: str, headers: str = None, params: str = None
    ) -> Response:
        """ """
        http_client = return_client_http()
        request = http_client.build_request(method, url, headers=headers, params=params)
        response = http_client.send(request)
        return response

    def get_currency_values(self, first_currency: str, second_currency: str) -> dict:
        """ """
        api_request_currencys = ["USD" "BRL" "EUR" "BTC" "ETH"]
        invalid_values = any(
            [
                first_currency not in api_request_currencys,
                second_currency not in api_request_currencys,
            ]
        )
        if invalid_values:
            raise ValueError("Valores invalidos para a api")
        url = (
            BASE_URL + f"/json/last/{first_currency.upper()}-{second_currency.upper()}"
        )
        response: Response = self._execute(method="GET", url=url)
        if response.status_code != status.HTTP_200_OK:
            raise IndexError("Valores invalidos para a api")
        return response.json()
