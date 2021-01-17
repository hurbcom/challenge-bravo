from typing import List

from .base import BaseRepository

from model import Currency


class CurrencyRepository(BaseRepository):
    def __init__(self):
        super().__init__(model_cls=Currency)

    @staticmethod
    def get_standard_currency():
        return Currency.objects(standard=True).first()

    @staticmethod
    def get_by_iso_codes(iso_codes: List[str]):
        return Currency.objects(iso_code__in=iso_codes)
