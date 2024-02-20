import logging

from app.api.v1.currency_converter.exceptions import CurrencyServiceException
from app.api.v1.currency_converter.models import Currency
from app.api.v1.currency_converter.utils import (
    amount_from_api_response,
    amount_from_bd_response,
)
from app.exceptions.default_exceptions import (
    ApiInvalidResponseException,
    CurrencyInvalidValuesException,
)
from app.repository.mongo_repository import MongoRepository
from app.services.awesomeapi import AwesomeApiService

logger = logging.getLogger(__name__)
CURRENCY_DATABASE = "currency_db"
CURRENCY_COLLECTION = "currencys"


class CurrencyConverterService:
    def __init__(self) -> None:
        self.awesome_service = AwesomeApiService()
        self.mongo_repository = MongoRepository()

    def get_currency(self, from_: str = "", to: str = "", amount: float = None) -> str:
        try:
            awesome_response = self.awesome_service.get_currency_values(from_, to)
            actual_value = amount_from_api_response(from_, to, amount, awesome_response)
        except (CurrencyInvalidValuesException, ApiInvalidResponseException):
            logger.info("Erro no retorno da API, buscando valores no banco de dados!")
            actual_value = self._get_currency_values_from_db(from_, to, amount)
        return actual_value

    def get_currency_by_acronym(self, acronym: str) -> dict | None:
        if response := self.mongo_repository.get_by_acronym(
            CURRENCY_DATABASE, CURRENCY_COLLECTION, acronym.upper()
        ):
            response = Currency.model_validate(response).model_dump()
        return response

    def create_currency(self, payload: Currency) -> dict | None:
        try:
            self.mongo_repository.create(
                CURRENCY_DATABASE, CURRENCY_COLLECTION, payload.model_dump()
            )
        except Exception as error:
            logger.error("Erro não mapeado", extra={"error": error})
            raise CurrencyServiceException(detail={"error": "erro ao deletar currency"})
        return payload.id

    def delete_currency(self, id: str) -> dict | None:
        try:
            self.mongo_repository.delete_by_id(
                CURRENCY_DATABASE, CURRENCY_COLLECTION, id
            )
        except Exception as error:
            logger.error("Erro não mapeado", extra={"error": error})
            raise CurrencyServiceException(detail={"error": "erro ao deletar currency"})
        return id

    def delete_currency_by_name(self, acronym: str) -> dict | None:
        try:
            self.mongo_repository.delete_by_acronym(
                CURRENCY_DATABASE, CURRENCY_COLLECTION, acronym
            )
        except Exception as error:
            logger.error("Erro não mapeado", extra={"error": error})
            raise CurrencyServiceException(detail={"error": "erro ao deletar currency"})
        return acronym

    def _get_currency_values_from_db(self, from_, to, amount):
        corrent_currency: dict = self.mongo_repository.get_by_acronym(
            CURRENCY_DATABASE, CURRENCY_COLLECTION, from_
        )
        pass_current: dict = self.mongo_repository.get_by_acronym(
            CURRENCY_DATABASE, CURRENCY_COLLECTION, to
        )

        amount = amount_from_bd_response(
            corrent_currency.get("quotation"),
            pass_current.get("quotation"),
            amount=amount,
        )

        return amount
