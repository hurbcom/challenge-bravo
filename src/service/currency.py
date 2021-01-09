from .base import BaseService

from repository import CurrencyRepository


class CurrencyService(BaseService):
    def __init__(self):
        super().__init__(repository=CurrencyRepository())
