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
        with http_client:
            request = http_client.build_request(
                method, url, headers=headers, params=params
            )
            response = http_client.send(request)
        return response

    def get_currency_values(self, first_currency: str, second_currency: str) -> dict:
        """ """
        url = (
            BASE_URL + f"/json/last/{first_currency.upper()}-{second_currency.upper()}"
        )

        response: Response = self._execute(method="GET", url=url)
        if response.status_code != status.HTTP_200_OK:
            return ""  # RETORNAR EXCEÇÃO
        return response.json()
