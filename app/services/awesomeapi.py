import logging

from fastapi import status
from httpx import (
    Client,
    Response,
)

from app.exceptions.default_exceptions import (
    ApiInvalidResponseException,
    CurrencyInvalidValuesException,
)

logger = logging.getLogger(__name__)
BASE_URL = "https://economia.awesomeapi.com.br"


class AwesomeApiService:
    def _execute(
        self, url: str, method: str, headers: str = None, params: str = None
    ) -> Response:
        """ """
        with Client(timeout=15) as http_client:
            request = http_client.build_request(
                method, url, headers=headers, params=params
            )
            response = http_client.send(request)
        return response

    def get_currency_values(self, first_currency: str, second_currency: str) -> dict:
        """ """
        api_request_currencys = ["USD", "BRL", "EUR", "BTC", "ETH"]
        valid_values = all(
            [
                first_currency in api_request_currencys,
                second_currency in api_request_currencys,
            ]
        )
        if not valid_values:
            logger.error("Valores de moeda invalidos")
            raise CurrencyInvalidValuesException()
        url = (
            BASE_URL + f"/json/last/{first_currency.upper()}-{second_currency.upper()}"
        )
        response: Response = self._execute(method="GET", url=url)
        if response.status_code != status.HTTP_200_OK:
            logger.error("Api retornou status não valido.")
            raise ApiInvalidResponseException()
        return response.json()

    def get_mapped_currencys(self) -> list[dict]:
        """ """
        dolar = "USD"
        brl = "BRL"
        eur = "EUR"
        btc = "BTC"
        eth = "ETH"
        url = (
            BASE_URL
            + f"/json/last/{brl}-{dolar},{eur}-{dolar},{btc}-{dolar},{eth}-{dolar}"
        )
        response: Response = self._execute(method="GET", url=url)
        if response.status_code != status.HTTP_200_OK:
            logger.error("Api retornou status não valido")
            raise ApiInvalidResponseException()
        return response.json()
