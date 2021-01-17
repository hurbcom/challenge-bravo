from typing import Dict
from datetime import datetime

from .base import BaseService
from repository import CurrencyRepository
from exception import BravoException, REP001, CRY001


class CurrencyService(BaseService):
    def __init__(self):
        super().__init__(repository=CurrencyRepository())

    def create(self, data: Dict) -> Dict:
        standard_currency = CurrencyRepository.get_standard_currency()
        if standard_currency and data.get("standard"):
            raise BravoException(CRY001)

        currency = super(CurrencyService, self).create(data)
        return currency

    def list_all(self, page_number: int, page_size: int, ordering: str = None) -> Dict:
        if not ordering:
            ordering = "iso_code"
        currencies = super(CurrencyService, self).list_all(
            page_number, page_size, ordering
        )
        return currencies

    def update_by_id(self, currency_id: str, new_data: Dict):
        standard_currency = CurrencyRepository.get_standard_currency()
        if (
            standard_currency
            and str(standard_currency.id) != currency_id
            and new_data.get("standard")
        ):
            raise BravoException(CRY001)

        new_data.update({"update_date": datetime.utcnow()})
        currency = super(CurrencyService, self).update_by_id(currency_id, new_data)
        if not currency:
            raise BravoException(REP001)
        return currency

    def delete_by_id(self, currency_id: str):
        currency_obj_id = super(CurrencyService, self).delete_by_id(currency_id)
        if not currency_obj_id:
            raise BravoException(REP001)
