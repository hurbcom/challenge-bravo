import logging

from app.api.v1.currency_converter.exceptions import CurrencyServiceException
from app.api.v1.currency_converter.models import Currency
from app.api.v1.currency_converter.utils import (
    amount_from_api_response,
    amount_from_bd_response,
)
from app.exceptions.default_exceptions import MongoRepositoryTransactionsException
from app.repository.mongo_repository import MongoRepository
from app.repository.redis_repository import RedisRepository
from app.services.awesomeapi import AwesomeApiService

logger = logging.getLogger(__name__)
CURRENCY_DATABASE = "currency_db"
CURRENCY_COLLECTION = "currencys"
DATE_COLLECTION = "daily_time"


class CurrencyConverterService:
    def __init__(self) -> None:
        self.awesome_service = AwesomeApiService()
        self.mongo_repository = MongoRepository(server_timeout=100)
        self.redis = RedisRepository()

    def get_currency(self, from_: str = "", to: str = "", amount: float = None) -> str:
        try:
            return self._get_currency_values_from_db(from_, to, amount)
        except MongoRepositoryTransactionsException:
            logger.info("Error in database, trying to get values in the api")
        awesome_response = self.awesome_service.get_currency_values(from_, to)
        actual_value = amount_from_api_response(from_, to, amount, awesome_response)
        return actual_value

    def get_currency_by_acronym(self, acronym: str) -> dict | None:
        if response := self.mongo_repository.get_by_acronym(
            CURRENCY_DATABASE, CURRENCY_COLLECTION, acronym.upper()
        ):
            response = Currency.model_validate(response).model_dump()
        return response

    def get_all_currency(self) -> list[dict] | None:
        if response := self.redis.get("all_currencys"):
            return response

        response = self.mongo_repository.get_all_currency(
            CURRENCY_DATABASE, CURRENCY_COLLECTION
        )
        response = [
            Currency.model_validate(response).model_dump() for response in response
        ]
        self.redis.create("all_currencys", response)
        return response

    def create_currency(self, payload: Currency) -> dict | None:
        try:
            self.mongo_repository.create(
                CURRENCY_DATABASE, CURRENCY_COLLECTION, payload.model_dump()
            )
        except Exception as error:
            logger.error("Unmapped error", extra={"error": error})
            raise CurrencyServiceException(detail={"error": "Error to create currency"})
        return payload.id

    def delete_currency(self, id: str) -> dict | None:
        try:
            self.mongo_repository.delete_by_id(
                CURRENCY_DATABASE, CURRENCY_COLLECTION, id
            )
        except Exception as error:
            logger.error("Unmapped error", extra={"error": error})
            raise CurrencyServiceException(detail={"error": "Error to delete currency"})
        return id

    def delete_currency_by_acronym(self, acronym: str) -> dict | None:
        try:
            self.mongo_repository.delete_by_acronym(
                CURRENCY_DATABASE, CURRENCY_COLLECTION, acronym
            )
        except Exception as error:
            logger.error("Unmapped error", extra={"error": error})
            raise CurrencyServiceException(detail={"error": "Error to delete currency"})
        return acronym

    def _get_currency_values_from_db(self, from_, to, amount):
        current_currency: dict = self.redis.get(from_)
        currency_to_exchange: dict = self.redis.get(to)
        if not current_currency:
            current_currency: dict = self.mongo_repository.get_by_acronym(
                CURRENCY_DATABASE, CURRENCY_COLLECTION, from_
            )
            current_currency = Currency.model_validate(current_currency).model_dump()
            self.redis.create(from_, current_currency)

        if not currency_to_exchange:
            currency_to_exchange: dict = self.mongo_repository.get_by_acronym(
                CURRENCY_DATABASE, CURRENCY_COLLECTION, to
            )
            currency_to_exchange = Currency.model_validate(
                currency_to_exchange
            ).model_dump()
            self.redis.create(to, currency_to_exchange)

        amount = amount_from_bd_response(
            current_currency.get("dolar_price_reference"),
            currency_to_exchange.get("dolar_price_reference"),
            amount=amount,
        )
        return amount
