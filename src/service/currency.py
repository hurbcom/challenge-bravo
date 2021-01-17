from typing import Dict
from datetime import datetime

from .base import BaseService
from repository import CurrencyRepository
from exception import BravoException, REP001


class CurrencyService(BaseService):
    def __init__(self):
        super().__init__(repository=CurrencyRepository())

    def list_all(self, page_number: int, page_size: int, ordering: str = None) -> Dict:
        if not ordering:
            ordering = "iso_code"
        currencies = super(CurrencyService, self).list_all(
            page_number, page_size, ordering
        )
        return currencies

    def update_by_id(self, currency_id: str, new_data: Dict):
        new_data.update({"update_date": datetime.utcnow()})
        currency = super(CurrencyService, self).update_by_id(currency_id, new_data)
        if not currency:
            raise BravoException(REP001)
        return currency

    def delete_by_id(self, currency_id: str):
        currency_obj_id = super(CurrencyService, self).delete_by_id(currency_id)
        if not currency_obj_id:
            raise BravoException(REP001)
