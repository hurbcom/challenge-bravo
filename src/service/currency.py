from typing import Dict, List
from datetime import datetime

from .base import BaseService
from repository import CurrencyRepository
from exception import BravoException, REP001, CRY001, CRY002, CRP001, CRP002, CRP003
from integration import CurrencyPairIntegration


class CurrencyService(BaseService):
    def __init__(self):
        super().__init__(repository=CurrencyRepository())

    @staticmethod
    def _get_currency_pair(from_currencies: List[str], to_currency: str) -> Dict:
        currency_pair = CurrencyPairIntegration.get_currency_pair(
            from_currencies=from_currencies, to_currency=to_currency
        )
        if not currency_pair:
            raise BravoException(CRP001)

        if "status" in currency_pair and currency_pair["status"] == 404:
            raise BravoException(CRP002)

        return currency_pair

    @staticmethod
    def do_conversion(from_currency: str, to_currency: str, amount: float) -> Dict:
        from_currency = from_currency.upper()
        to_currency = to_currency.upper()

        currencies = list(
            CurrencyRepository.get_by_iso_codes([from_currency, to_currency])
        )
        currencies_iso_codes = list(map(lambda c: c.iso_code, currencies))

        if from_currency not in currencies_iso_codes:
            raise BravoException(CRY002(from_currency))

        if to_currency not in currencies_iso_codes:
            raise BravoException(CRY002(to_currency))

        standard_currency = CurrencyRepository.get_standard_currency()
        if standard_currency.iso_code != "BRL":
            raise BravoException(CRP003)

        if standard_currency.iso_code != to_currency:
            currency_pairs = CurrencyService._get_currency_pair(
                from_currencies=[from_currency, to_currency],
                to_currency=standard_currency.iso_code,
            )
            from_currency_value = float(currency_pairs[from_currency]["bid"])
            to_currency_value = float(currency_pairs[to_currency]["ask"])
            currency_value = from_currency_value / to_currency_value
        else:
            currency_pairs = CurrencyService._get_currency_pair(
                from_currencies=[from_currency], to_currency=to_currency
            )
            currency_value = float(currency_pairs[from_currency]["bid"])

        return {"amount": round(amount * currency_value, 4)}

    def create(self, data: Dict) -> Dict:
        standard_currency = CurrencyRepository.get_standard_currency()
        if standard_currency and data.get("standard"):
            raise BravoException(CRY001)

        new_data = {**data, "iso_code": data["iso_code"].upper()}
        currency = super(CurrencyService, self).create(new_data)
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

        if "iso_code" in new_data:
            new_data.update({"iso_code": new_data["iso_code"].upper()})
        new_data.update({"update_date": datetime.utcnow()})
        currency = super(CurrencyService, self).update_by_id(currency_id, new_data)
        if not currency:
            raise BravoException(REP001)
        return currency

    def delete_by_id(self, currency_id: str):
        currency_obj_id = super(CurrencyService, self).delete_by_id(currency_id)
        if not currency_obj_id:
            raise BravoException(REP001)
