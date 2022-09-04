from pydantic import BaseModel, validator
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, Query
from typing import List, Union, Optional
from datetime import datetime

from app.models import OficialCoin, FantasyCoin
from app.schemas.currency import CurrencyDatabase



class CurrencyOperator(BaseModel):
    currency_code: Optional[str]
    rate: Optional[float]
    backed_by: Optional[str]
    updated_at: Optional[datetime]

    @validator("currency_code")
    def uppercase_currency_code(cls, currency_code: str):

        return currency_code.upper()


    def _query_oficial_fantasy_union(self, db: Session) -> Query:

        oficial_table_query = db.query(OficialCoin).filter(OficialCoin.currency_code == self.currency_code)
        fantasy_table_query = db.query(FantasyCoin).filter(FantasyCoin.currency_code == self.currency_code)
        query_union = oficial_table_query.union(fantasy_table_query)
        return query_union


    def _find_currency_in_db(self, db: Session) -> Union[CurrencyDatabase, None]:
        """ If currency exists in `oficial_coins` or `fantasy_coins` returns it else return `None`"""

        currency_db = self._query_oficial_fantasy_union(db=db).first()
        return currency_db


    def _find_backed_currency_in_db(self, db: Session) -> Union[CurrencyDatabase, None]:
        """ If backed currency exists in `oficial_coins` returns it else returns `None` """

        oficial_table_query = db.query(OficialCoin).filter(OficialCoin.currency_code == self.backed_by)
        currency_db = oficial_table_query.first()
        return currency_db


    def read_all(self, db: Session) -> List:
        """ Returns a list of quotes from `oficial_coins` and `fantasy_coins` tables """

        oficial_table_query = db.query(
            OficialCoin.currency_code.label("currency_code"),
            OficialCoin.rate,
            OficialCoin.backed_by,
            OficialCoin.updated_at,
            OficialCoin.currency_type).order_by(OficialCoin.currency_code)

        fantasy_table_query = db.query(
            FantasyCoin.currency_code.label("currency_code"),
            FantasyCoin.rate,
            FantasyCoin.backed_by,
            FantasyCoin.updated_at,
            FantasyCoin.currency_type).order_by(FantasyCoin.currency_code)

        currency_list = oficial_table_query.union(fantasy_table_query).order_by("currency_code").all()

        # Raises an HTTP exception if currency is not found
        if not currency_list:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Currency code {self.currency_code} not found"
            )

        return currency_list


    def read(self, db: Session) -> CurrencyDatabase:
        """ If currency exists in `oficial_coins` or `fantasy_coins` returns it else return `None`"""

        currency = self._find_currency_in_db(db=db)

        # Raises an HTTP exception if currency is not found
        if not currency:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Currency code {self.currency_code} not found"
            )
        return CurrencyDatabase.from_orm(currency)


    def create(self, db: Session) -> CurrencyDatabase:
        """ Creates a new currency in `fantasy_coins` if not found in database """

        # Raises an HTTP exception if currency already exists
        if self._find_currency_in_db(db=db):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Currency code {self.currency_code} already exists"
            )

        # Raises an HTTP exception if backed currency is not found
        if not self._find_backed_currency_in_db(db=db):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Backed currency code {self.backed_by} is not valid"
            )

        currency = FantasyCoin(**self.dict())
        db.add(currency)
        db.commit()
        db.refresh(currency)
        return CurrencyDatabase.from_orm(currency)


    def update(self, db: Session, original_currency_code: str) -> CurrencyDatabase:
        """ Updated currency in `fantasy_coins` if found in database """

        original_currency_code = original_currency_code.upper()
        # In case of currency code change
        if original_currency_code != self.currency_code:
            original_currency_code_in_db = db.query(FantasyCoin).filter(FantasyCoin.currency_code == original_currency_code).first()
            # Raises an HTTP exception if original currency code is not found
            if not original_currency_code_in_db:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Original currency code {original_currency_code} not found"
                )
            # Raises an HTTP exception if new currency code is not found
            if self._find_currency_in_db(db=db):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"New currency code {self.currency_code} already exists"
                )
        else:
        # Raises an HTTP exception if new currency code is not found
            if not self._find_currency_in_db(db=db):
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Currency code {self.currency_code} not found"
                )

        # Raises an HTTP exception if backed currency is not found
        if not self._find_backed_currency_in_db(db=db):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Backed currency code {self.backed_by} not found"
            )

        if original_currency_code != self.currency_code:
            currency_code_db = original_currency_code
        else:
            currency_code_db = self.currency_code

        currency_db = db.query(FantasyCoin).filter(FantasyCoin.currency_code == currency_code_db)
        currency_db.update(self.dict())
        db.commit()

        updated_currency = self._find_currency_in_db(db=db)
        return CurrencyDatabase.from_orm(updated_currency)


    def delete(self, db: Session):
        """ Delete currency from `fantasy_coins` if found in database """

        currency = self._find_currency_in_db(db=db)

        # Raises an HTTP exception if currency is not found
        if not currency:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Currency code {self.currency_code} not found"
            )

        # Raises an HTTP exception if currency is an oficial currency
        if currency.currency_type == "oficial":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Currency code {self.currency_code} is an oficial currency and cannot be deleted"
            )

        currency_query = db.query(FantasyCoin).filter(FantasyCoin.currency_code == self.currency_code)
        currency_query.delete()
        db.commit()
        return