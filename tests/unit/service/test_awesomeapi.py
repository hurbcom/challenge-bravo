from unittest.mock import (
    Mock,
    patch,
)

from fastapi import status
from httpcore import Request
from httpx import (
    Client,
    Response,
)

from app.exceptions.default_exceptions import (
    ApiInvalidResponseException,
    CurrencyInvalidValuesException,
)
from app.services.awesomeapi import AwesomeApiService
from tests.unit import DefaultTestCase

default_date_format = "%d/%m/%Y"


class AwesomeApiServiceTestCase(DefaultTestCase):

    @patch.object(Client, "build_request")
    @patch.object(Client, "send")
    def test_get_currency_values(self, mock_http_send: Mock, mock_build_request: Mock):

        mock_build_request.return_value = Request("GET", "http/test")
        mock_http_send.return_value = Response(
            status_code=status.HTTP_200_OK, content='{"test":"testing"}'
        )
        service = AwesomeApiService()
        response = service.get_currency_values("USD", "BRL")

        self.assertTrue(response)
        self.assertEqual(response, {"test": "testing"})

    @patch.object(Client, "build_request")
    @patch.object(Client, "send")
    def test_get_currency_values_raise_exception_when_receive_invalid_values(
        self, mock_http_send: Mock, mock_build_request: Mock
    ):

        mock_build_request.return_value = Request("GET", "http/test")
        mock_http_send.return_value = Response(
            status_code=status.HTTP_200_OK, content="{'test':'testing'}"
        )
        service = AwesomeApiService()

        with self.assertRaises(CurrencyInvalidValuesException) as context_error:
            service.get_currency_values("USD", "BBB")
        self.assertEqual(context_error.exception.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            context_error.exception.detail, {"error": "Invalid values for the api"}
        )

    @patch.object(Client, "build_request")
    @patch.object(Client, "send")
    def test_get_mapped_currencys(self, mock_http_send: Mock, mock_build_request: Mock):

        mock_build_request.return_value = Request("GET", "http/test")
        mock_http_send.return_value = Response(
            status_code=status.HTTP_200_OK, content='{"test":"testing"}'
        )
        service = AwesomeApiService()
        response = service.get_mapped_currencys()

        self.assertTrue(response)
        self.assertEqual(response, {"test": "testing"})

    @patch.object(Client, "build_request")
    @patch.object(Client, "send")
    def test_get_mapped_currencys_raise_exception_when_receive_invalid_status_code(
        self, mock_http_send: Mock, mock_build_request: Mock
    ):

        mock_build_request.return_value = Request("GET", "http/test")
        mock_http_send.return_value = Response(
            status_code=status.HTTP_404_NOT_FOUND, content='{"detail":"Not found"}'
        )
        service = AwesomeApiService()

        with self.assertRaises(ApiInvalidResponseException) as context_error:
            service.get_mapped_currencys()

        self.assertEqual(context_error.exception.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            context_error.exception.detail, {"error": "Invalid values for the api"}
        )
