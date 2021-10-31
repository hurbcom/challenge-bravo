from typing import Optional

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.currency import Currency
from app.schemas.currency import CurrencyCreate, CurrencyUpdate


class CRUDCurrency(CRUDBase[Currency, CurrencyCreate, CurrencyUpdate]):
    def get_by_code(self, db: Session, *, code: str) -> Optional[Currency]:
        return db.query(Currency).filter(Currency.code == code).first()


currency = CRUDCurrency(Currency)
