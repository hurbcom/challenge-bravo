from types import FunctionType
from typing import Any
from unittest.mock import (
    Mock,
    patch,
)

from fastapi import status
from pymongo.database import Database

from app.exceptions.default_exceptions import MongoRepositoryTransactionsException
from app.repository.mongo_repository import MongoRepository
from tests.unit import DefaultTestCase
from tests.unit.test_utils import MongoMockDB

default_date_format = "%d/%m/%Y"


class MongoRepositoryTestCase(DefaultTestCase):

    def setUp(self) -> None:
        self.db_name = "db_name"
        self.collection = "db_collection"
        self.mongo_mock_aux = MongoMockDB()
        return super().setUp()

    def test_mongo_db_return(self):
        service = MongoRepository()
        response = service._get_database("currencys-test")
        self.assertEqual(response.name, "currencys-test")
        self.assertTrue(type(response) is Database)

    @patch.object(MongoRepository, "_get_database")
    def test_get_by_id_in_repository(self, bd_mock: Mock):

        bd_mock.return_value = self.mongo_mock_aux
        service = MongoRepository()
        functions_list = [
            (service.get_by_id, "id_value"),
            (service.get_by_acronym, "acronym_value"),
            (service.get_all_currency, None),
            (service.get_cached_date, None),
            (service.create, {"test": "id"}),
            (service.delete_by_id, "id_value"),
            (service.delete_by_acronym, "id_value"),
            (service.delete_by_acronym, "id_value"),
            (service.update_or_create_date_cache, {"test": "id"}),
        ]

        for func in functions_list:
            function_to_use = func[0]
            data_to_use_in_func = func[1]
            self._is_repository_response_valid(
                function_to_use, data_to_use_in_func, bd_mock
            )

    @patch.object(MongoRepository, "_get_database")
    def test_repository_raises_unexpected_exception(self, bd_mock: Mock):

        bd_mock.side_effect = Exception("test error")
        service = MongoRepository()
        functions_list = [
            (service.get_by_id, "id_value"),
            (service.get_by_acronym, "acronym_value"),
            (service.get_all_currency, None),
            (service.get_cached_date, None),
            (service.create, {"test": "id"}),
            (service.delete_by_id, "id_value"),
            (service.delete_by_acronym, "id_value"),
            (service.delete_by_acronym, "id_value"),
            (service.update_or_create_date_cache, {"test": "id"}),
        ]

        for func in functions_list:
            function_to_use = func[0]
            data_to_use_in_func = func[1]
            self._is_repository_response_exception_valid(
                function_to_use, data_to_use_in_func, bd_mock
            )

        with self.assertRaises(MongoRepositoryTransactionsException) as context_error:
            service.update_by_id(
                self.db_name, self.collection, "123321", {"updt": "test"}
            )
        bd_mock.assert_called()
        self.assertEqual(
            context_error.exception.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        self.assertEqual(
            context_error.exception.detail, {"error": "Invalid transaction in mongoDB"}
        )

        with self.assertRaises(MongoRepositoryTransactionsException) as context_error:
            service.update_or_create_by_acronym(
                self.db_name, self.collection, "USD", {"updt": "test"}
            )
        bd_mock.assert_called()
        self.assertEqual(
            context_error.exception.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        self.assertEqual(
            context_error.exception.detail, {"error": "Invalid transaction in mongoDB"}
        )

    def _is_repository_response_valid(
        self, function_to_test: FunctionType, function_data: dict, bd_mock: Mock
    ):
        if function_data:
            response = function_to_test(self.db_name, self.collection, function_data)
        else:
            response = function_to_test(self.db_name, self.collection)
        bd_mock.assert_called()
        self.assertEqual(response, response)

    def _is_repository_response_exception_valid(
        self, function_to_test: FunctionType, function_data: Any, bd_mock: Mock
    ):
        with self.assertRaises(MongoRepositoryTransactionsException) as context_error:
            if function_data:
                function_to_test(self.db_name, self.collection, function_data)
            else:
                function_to_test(self.db_name, self.collection)
        bd_mock.assert_called()
        self.assertEqual(
            context_error.exception.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        self.assertEqual(
            context_error.exception.detail, {"error": "Invalid transaction in mongoDB"}
        )
