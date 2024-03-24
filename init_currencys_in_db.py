import logging

from app.api.v1.currency_converter.models import Currency
from app.repository.mongo_repository import MongoRepository
from app.services.awesomeapi import AwesomeApiService

logger = logging.getLogger(__name__)
CURRENCY_DATABASE = "currency_db"
CURRENCY_COLLECTION = "currencys"
DATE_COLLECTION = "daily_time"
repository_timeout = 2000  # time in milliseconds
repository = MongoRepository(repository_timeout)


def init_currency_values_in_bd() -> None:
    awesome_service = AwesomeApiService()
    try:
        api_currencys: dict = awesome_service.get_mapped_currencys()
        for _, currency_data in api_currencys.items():
            # Depois de explitar, pega o ultimo valor.
            name = currency_data.get("name", "").split("/")[0]
            insert_currency = Currency(
                acronym=currency_data.get("code"),
                dolar_price_reference=currency_data.get("bid"),
                name=name,
            ).model_dump()
            create_currency_in_db(currency_data.get("code"), insert_currency)

        insert_currency = Currency(
            acronym="USD", name="dólar americano", dolar_price_reference=1
        ).model_dump()
        create_currency_in_db("USD", insert_currency)
    except Exception as error:
        logger.error(f"Error when try to get api values. Error: {error}")


def create_currency_in_db(acronym: str, data: dict):
    repository.update_or_create_by_acronym(
        CURRENCY_DATABASE, CURRENCY_COLLECTION, acronym, data
    )


if __name__ == "__main__":
    init_currency_values_in_bd()
