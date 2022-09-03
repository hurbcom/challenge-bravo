from pydantic import BaseModel, validator
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, Query
from typing import List, Union, Optional
from datetime import datetime

from app.models import OficialCoin, FantasyCoin
from app.schemas import CurrencyDatabase



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