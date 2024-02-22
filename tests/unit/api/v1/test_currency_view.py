import json
from datetime import (
    datetime,
    timedelta,
)
from unittest.mock import (
    Mock,
    patch,
)
from uuid import uuid4

from fastapi import status
from fastapi.responses import JSONResponse
from httpx import Response

from app.api.v1.currency_converter.exceptions import (
    CurrencyServiceException,
    GenericApiException,
    ValidateAcronymException,
)
from app.api.v1.currency_converter.models import (
    Currency,
    DeleteCurrencyByAcronym,
    DeleteCurrencyById,
)
from app.api.v1.currency_converter.views import (
    create_currency,
    delete_currency,
    delete_currency_by_acronym,
    get_all_currency,
    get_currency,
    get_currency_by_acronym,
)
from app.exceptions.default_exceptions import ApiInvalidResponseException
from tests.unit import DefaultTestCase

default_date_format = "%d/%m/%Y"


class CurrencyViewsTestCase(DefaultTestCase):

    def setUp(self) -> None:
        return super().setUp()

    @patch("app.repository.mongo_repository.MongoRepository.get_by_acronym")
    @patch("app.repository.mongo_repository.MongoRepository.get_cached_date")
    def test_get_currency(self, mock_get_cached_date: Mock, mock_get_by_acronym: Mock):

        return_mock = Currency(
            acronym="TEST", name="TESTE-NAME", dolar_price_reference=10
        )
        afterday = datetime.now() - timedelta(days=1)
        mock_get_by_acronym.return_value = return_mock.model_dump()
        mock_get_cached_date.return_value = {"date": afterday}

        response: JSONResponse = get_currency(from_="USD", to="BRL", amount=200)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response.body), {"converted_value": "200.000000"})

    @patch("app.utils.init_currencys.init_currency_values_in_bd")
    @patch("app.services.awesomeapi.AwesomeApiService._execute")
    @patch("app.repository.mongo_repository.MongoRepository.get_cached_date")
    def test_get_currency_passing_in_the_api(
        self, mock_get_cached_date: Mock, mock_currency_api: Mock, mock_init_bd: Mock
    ):

        afterday = datetime.now() + timedelta(days=1)
        mock_init_bd.return_value = True
        mock_currency_api.return_value = Response(
            status.HTTP_200_OK, content='{"USDBRL": {"bid": 1}}'
        )
        mock_get_cached_date.return_value = {"date": afterday}
        response: JSONResponse = get_currency(from_="USD", to="BRL", amount=200)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response.body), {"converted_value": "200.00"})

    @patch("app.utils.init_currencys.init_currency_values_in_bd")
    @patch("app.services.awesomeapi.AwesomeApiService._execute")
    @patch("app.repository.mongo_repository.MongoRepository.get_cached_date")
    def test_get_currency_passing_in_the_api_and_return_it_invalid_response(
        self, mock_get_cached_date: Mock, mock_currency_api: Mock, mock_init_bd: Mock
    ):

        afterday = datetime.now() + timedelta(days=1)
        mock_init_bd.return_value = True
        mock_currency_api.return_value = Response(
            status.HTTP_400_BAD_REQUEST, content='{"error": "bad-request"}'
        )
        mock_get_cached_date.return_value = {"date": afterday}

        with self.assertRaises(ApiInvalidResponseException) as context_error:
            get_currency(from_="USD", to="BRL", amount=200)
        self.assertEqual(context_error.exception.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            context_error.exception.detail, {"error": "Invalid values for the api"}
        )

    @patch("app.utils.init_currencys.init_currency_values_in_bd")
    @patch("app.repository.mongo_repository.MongoRepository.get_cached_date")
    def test_get_currency_raise_generic_error(
        self, mock_get_by_acronym: Mock, mock_get_cached_date: Mock
    ):

        return_value = Currency(
            acronym="TEST", name="TESTE-NAME", dolar_price_reference=10
        ).model_dump()
        mock_get_by_acronym.side_effect = return_value
        mock_get_cached_date.side_effect = Exception("test error")

        with self.assertRaises(GenericApiException) as context_error:
            get_currency(from_="USD", to="BRL", amount=200)
        self.assertEqual(
            context_error.exception.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        self.assertEqual(
            context_error.exception.detail, {"error": "Some error ocurred!"}
        )

    @patch("app.repository.mongo_repository.MongoRepository.get_by_acronym")
    def test_get_currency_by_acronym(self, mock_get_by_acronym: Mock):

        return_value = Currency(
            acronym="TEST", name="TESTE-NAME", dolar_price_reference=10
        ).model_dump()
        mock_get_by_acronym.return_value = return_value

        response: JSONResponse = get_currency_by_acronym(acronym="USD")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response.body), return_value)

    @patch("app.repository.mongo_repository.MongoRepository.get_by_acronym")
    def test_get_currency_by_acronym_not_found_value(self, mock_get_by_acronym: Mock):

        mock_get_by_acronym.return_value = None
        response: JSONResponse = get_currency_by_acronym(acronym="USD")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(json.loads(response.body), {})

    @patch("app.repository.mongo_repository.MongoRepository.get_by_acronym")
    def test_get_currency_by_acronym_repository_raises_unexpected_error(
        self, mock_get_by_acronym: Mock
    ):

        mock_get_by_acronym.side_effect = Exception("test error")

        with self.assertRaises(GenericApiException) as context_error:
            get_currency_by_acronym(acronym="USD")
        self.assertEqual(
            context_error.exception.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        self.assertEqual(
            context_error.exception.detail, {"error": "Some error ocurred!"}
        )

    @patch("app.repository.mongo_repository.MongoRepository.get_all_currency")
    def test_get_all_currency(self, mock_get_by_acronym: Mock):

        return_value = Currency(
            acronym="TEST", name="TESTE-NAME", dolar_price_reference=10
        ).model_dump()
        return_value = [return_value]
        mock_get_by_acronym.return_value = return_value

        response: JSONResponse = get_all_currency()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response.body), return_value)

    @patch("app.repository.mongo_repository.MongoRepository.get_all_currency")
    def test_get_all_currency_and_repository_raises_unexpected_error(
        self, mock_get_by_acronym: Mock
    ):

        mock_get_by_acronym.side_effect = Exception("test error")

        with self.assertRaises(GenericApiException) as context_error:
            get_all_currency()
        self.assertEqual(
            context_error.exception.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        self.assertEqual(
            context_error.exception.detail, {"error": "Some error ocurred!"}
        )

    @patch("app.repository.mongo_repository.MongoRepository.create")
    def test_create_currency(self, mock_repository_create: Mock):

        payload = Currency(acronym="TEST", name="TESTE-NAME", dolar_price_reference=10)
        mock_repository_create.return_value = None

        response: JSONResponse = create_currency(payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(json.loads(response.body), {"id": payload.id})

    @patch("app.repository.mongo_repository.MongoRepository.create")
    def test_create_currency_repository_raises_unexpected_error(
        self, mock_repository_create: Mock
    ):

        mock_repository_create.side_effect = Exception("test error")
        payload = Currency(acronym="TEST", name="TESTE-NAME", dolar_price_reference=10)

        with self.assertRaises(CurrencyServiceException) as context_error:
            create_currency(payload)
        self.assertEqual(
            context_error.exception.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        self.assertEqual(
            context_error.exception.detail, {"error": "Error to create currency"}
        )

    @patch("app.repository.mongo_repository.MongoRepository.create")
    def test_create_model_raises_validate_error(self, mock_repository_create: Mock):

        mock_repository_create.side_effect = Exception("test error")
        with self.assertRaises(ValidateAcronymException) as context_error:
            create_currency(
                Currency(
                    acronym="TEST-ACRONYNM", name="TESTE-NAME", dolar_price_reference=10
                )
            )
        self.assertEqual(
            context_error.exception.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        self.assertEqual(
            context_error.exception.detail, {"error": "Acronym value not valid"}
        )

    @patch(
        "app.api.v1.currency_converter.service.CurrencyConverterService.create_currency"
    )
    def test_create_currency_endpoint_raises_unexpected_error(
        self, mock_repository_create: Mock
    ):

        mock_repository_create.side_effect = Exception("test error")
        payload = Currency(acronym="TEST", name="TESTE-NAME", dolar_price_reference=10)

        with self.assertRaises(GenericApiException) as context_error:
            create_currency(payload)
        self.assertEqual(
            context_error.exception.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        self.assertEqual(
            context_error.exception.detail, {"error": "Some error ocurred!"}
        )

    @patch("app.repository.mongo_repository.MongoRepository.delete_by_id")
    def test_delete_currency_by_id(self, mock_repository_delete: Mock):

        id = str(uuid4())
        payload = DeleteCurrencyById(id=id)
        mock_repository_delete.return_value = None

        response: JSONResponse = delete_currency(payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response.body), {"id": id})

    @patch("app.repository.mongo_repository.MongoRepository.delete_by_id")
    def test_delete_currency_and_repository_raises_unexpected_error(
        self, mock_repository_delete: Mock
    ):

        mock_repository_delete.side_effect = Exception("test error")
        id = str(uuid4())
        payload = DeleteCurrencyById(id=id)

        with self.assertRaises(CurrencyServiceException) as context_error:
            delete_currency(payload)
        self.assertEqual(
            context_error.exception.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        self.assertEqual(
            context_error.exception.detail, {"error": "Error to delete currency"}
        )

    @patch(
        "app.api.v1.currency_converter.service.CurrencyConverterService.delete_currency"
    )
    def test_delete_currency_endpoint_raises_unexpected_error(
        self, mock_delete_repository: Mock
    ):

        mock_delete_repository.side_effect = Exception("test error")
        payload = Currency(acronym="TEST", name="TESTE-NAME", dolar_price_reference=10)

        with self.assertRaises(GenericApiException) as context_error:
            delete_currency(payload)
        self.assertEqual(
            context_error.exception.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        self.assertEqual(
            context_error.exception.detail, {"error": "Some error ocurred!"}
        )

    @patch("app.repository.mongo_repository.MongoRepository.delete_by_acronym")
    def test_delete_currency_by_acronym(self, mock_repository_delete_by_acronym: Mock):

        payload = DeleteCurrencyByAcronym(acronym="USD")
        mock_repository_delete_by_acronym.return_value = None

        response: JSONResponse = delete_currency_by_acronym(payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response.body), {"acronym": payload.acronym})

    @patch("app.repository.mongo_repository.MongoRepository.delete_by_acronym")
    def test_delete_currency_by_acronym_and_repository_raises_unexpected_error(
        self, mock_repository_delete: Mock
    ):

        mock_repository_delete.side_effect = Exception("test error")
        payload = DeleteCurrencyByAcronym(acronym="USD")

        with self.assertRaises(CurrencyServiceException) as context_error:
            delete_currency_by_acronym(payload)
        self.assertEqual(
            context_error.exception.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        self.assertEqual(
            context_error.exception.detail, {"error": "Error to delete currency"}
        )

    @patch(
        (
            "app.api.v1.currency_converter.service.CurrencyConverterService."
            "delete_currency_by_acronym"
        )
    )
    def test_delete_currency_by_acronym_and_flow_raises_unexpected_error(
        self, mock_delete_currency_by_name: Mock
    ):

        mock_delete_currency_by_name.side_effect = Exception("test error")
        payload = DeleteCurrencyByAcronym(acronym="USD")

        with self.assertRaises(GenericApiException) as context_error:
            delete_currency_by_acronym(payload)
        self.assertEqual(
            context_error.exception.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        self.assertEqual(
            context_error.exception.detail, {"error": "Some error ocurred!"}
        )
