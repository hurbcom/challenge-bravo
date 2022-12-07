from datetime import datetime
from typing import List, Optional, Union

from fastapi import HTTPException, status
from pydantic import BaseModel, validator
from sqlalchemy.orm import Query, Session

from app.models import CurrenciesCoinsbaseModel, CreatedCoinsModel
from app.schemas.currencies import CurrencyDatabase


class CurrencyService(BaseModel):
    currency_code: Optional[str]
    rate: Optional[float]
    backed_by: Optional[str]
    updated_at: Optional[datetime]

    @validator("currency_code")
    def uppercase_currency_code(cls, currency_code: str):

        return currency_code.upper()

    def _query_coinbase_api_created_coin_union(self, db: Session) -> Query:

        coinbase_api_table_query = db.query(CurrenciesCoinsbaseModel).filter(
            CurrenciesCoinsbaseModel.currency_code == self.currency_code
        )
        created_coin_table_query = db.query(CreatedCoinsModel).filter(
            CreatedCoinsModel.currency_code == self.currency_code
        )
        return coinbase_api_table_query.union(created_coin_table_query)

    def _find_currency_in_db(self, db: Session) -> Union[CurrencyDatabase, None]:
        return self._query_coinbase_api_created_coin_union(db=db).first()

    def _find_backed_currency_in_db(self, db: Session) -> Union[CurrencyDatabase, None]:
        coinbase_api_table_query = db.query(CurrenciesCoinsbaseModel).filter(
            CurrenciesCoinsbaseModel.currency_code == self.backed_by
        )
        return coinbase_api_table_query.first()

    def read_all(self, db: Session) -> List:
        coinbase_api_table_query = db.query(
            CurrenciesCoinsbaseModel.currency_code.label("currency_code"),
            CurrenciesCoinsbaseModel.rate,
            CurrenciesCoinsbaseModel.backed_by,
            CurrenciesCoinsbaseModel.updated_at,
            CurrenciesCoinsbaseModel.currency_type,
        ).order_by(CurrenciesCoinsbaseModel.currency_code)

        created_coin_table_query = db.query(
            CreatedCoinsModel.currency_code.label("currency_code"),
            CreatedCoinsModel.rate,
            CreatedCoinsModel.backed_by,
            CreatedCoinsModel.updated_at,
            CreatedCoinsModel.currency_type,
        ).order_by(CreatedCoinsModel.currency_code)

        return (
            coinbase_api_table_query.union(created_coin_table_query)
            .order_by("currency_code")
            .all()
        )

    def read(self, db: Session) -> CurrencyDatabase:
        if currency := self._find_currency_in_db(db=db):
            return CurrencyDatabase.from_orm(currency)
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Currency code {self.currency_code} not found",
            )

    def create(self, db: Session) -> CurrencyDatabase:
        if self._find_currency_in_db(db=db):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Currency code {self.currency_code} already exists",
            )

        if not self._find_backed_currency_in_db(db=db):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Backed currency code {self.backed_by} is not valid",
            )

        currency = CreatedCoinsModel(**self.dict())
        db.add(currency)
        db.commit()
        db.refresh(currency)
        return CurrencyDatabase.from_orm(currency)

    def update(self, db: Session, original_currency_code: str) -> CurrencyDatabase:
        original_currency_code = original_currency_code.upper()
        if (
            original_currency_db_coinbase_api := db.query(
                CurrenciesCoinsbaseModel
            )
            .filter(
                CurrenciesCoinsbaseModel.currency_code == original_currency_code
            )
            .first()
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Currency code {original_currency_code} is an coinbase currency and cannot be changed",
            )

        if original_currency_code != self.currency_code:
            original_currency_code_in_db = (
                db.query(CreatedCoinsModel)
                .filter(CreatedCoinsModel.currency_code == original_currency_code)
                .first()
            )
            
            if not original_currency_code_in_db:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Original currency code {original_currency_code} not found",
                )
            
            if self._find_currency_in_db(db=db):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"New currency code {self.currency_code} already exists",
                )
        elif not self._find_currency_in_db(db=db):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Currency code {self.currency_code} not found",
            )

    
        if not self._find_backed_currency_in_db(db=db):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Backed currency code {self.backed_by} not found",
            )

        if original_currency_code != self.currency_code:
            currency_code_db = original_currency_code
        else:
            currency_code_db = self.currency_code

        currency_db = db.query(CreatedCoinsModel).filter(
            CreatedCoinsModel.currency_code == currency_code_db
        )
        currency_db.update(self.dict())
        db.commit()

        updated_currency = self._find_currency_in_db(db=db)
        return CurrencyDatabase.from_orm(updated_currency)

    def delete(self, db: Session):
        """Delete currency from `created_coin_currencies` if found in database"""

        currency = self._find_currency_in_db(db=db)

        if not currency:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Currency code {self.currency_code} not found",
            )

        if currency.currency_type == "coinbase":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Currency code {self.currency_code} is an coinbase currency and cannot be deleted",
            )

        currency_query = db.query(CreatedCoinsModel).filter(
            CreatedCoinsModel.currency_code == self.currency_code
        )
        currency_query.delete()
        db.commit()
        return {"message": f"Currency code {self.currency_code} deleted"}