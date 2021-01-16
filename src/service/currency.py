from .base import BaseService

from repository import CurrencyRepository


class CurrencyService(BaseService):
    def __init__(self):
        super().__init__(repository=CurrencyRepository())

    def list_all(self, page_number: int, page_size: int):
        currencies = super(CurrencyService, self).list_all(page_number, page_size)
        return list(currencies.order_by("iso_code"))
