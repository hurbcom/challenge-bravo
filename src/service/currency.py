from .base import BaseService

from repository import CurrencyRepository


class CurrencyService(BaseService):
    def __init__(self):
        super().__init__(repository=CurrencyRepository())

    def list_all(self, page_number: int, page_size: int, ordering: str = None):
        if not ordering:
            ordering = "iso_code"
        currencies = super(CurrencyService, self).list_all(
            page_number, page_size, ordering
        )
        return list(currencies)
