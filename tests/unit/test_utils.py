from unittest.mock import (
    Mock,
    patch,
)

from tests.unit import DefaultTestCase

default_date_format = "%d/%m/%Y"


class UtilsTestCase(DefaultTestCase):

    def setUp(self) -> None:
        return super().setUp()

    @patch(
        "app.repository.mongo_repository.MongoRepository.update_or_create_date_cache"
    )
    @patch(
        "app.repository.mongo_repository.MongoRepository.update_or_create_by_acronym"
    )
    @patch("app.services.awesomeapi.AwesomeApiService.get_mapped_currencys")
    def test_init_currency_values_in_bd(
        self,
        awesome_api_mock: Mock,
        mock_repository_up_create: Mock,
        mock_repository_cache: Mock,
    ):

        dolar = {"code": "USD", "bid": "1"}
        real = {"code": "BRL", "bid": "4"}
        response = {"USDBRL": dolar, "BRLUSD": real}
        awesome_api_mock.return_value = response
        mock_repository_up_create.return_value = None
        mock_repository_cache.return_value = None

        awesome_api_mock.assert_called()
        mock_repository_up_create.assert_called()
        mock_repository_cache.assert_called()

    @patch("app.services.awesomeapi.AwesomeApiService.get_mapped_currencys")
    def test_init_currency_values_in_bd_run_a_error_and_no_affect_the_flow(
        self, awesome_api_mock: Mock
    ):
        awesome_api_mock.side_effect = Exception("test error")
        awesome_api_mock.assert_called()


class MongoMockDB:

    def __getitem__(self, _):
        return self

    def find(self, filter, *_, **__):
        return _

    def find_one(self, filter, *_, **__):
        return filter

    def insert_one(self, filter, *_, **__):
        return _

    def delete_one(self, filter, *_, **__):
        return _

    def update_one(self, filter, *_, **__):
        return _

    def replace_one(self, filter, *_, **__):
        return _
