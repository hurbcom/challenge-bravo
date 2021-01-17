from .base import BaseRepository

from model import Currency


class CurrencyRepository(BaseRepository):
    def __init__(self):
        super().__init__(model_cls=Currency)

    @staticmethod
    def get_standard_currency():
        return Currency.objects(standard=True).first()
