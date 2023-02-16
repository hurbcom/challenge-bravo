from datetime import datetime
from typing import List, Union

from fastapi import HTTPException, status
from sqlalchemy import delete, select, update

from app.models.models import CurrencyInfoModel, CurrencyInfoModel
from app.models.database import async_session
from app.schemas.currency import CurrencyDatabase


class CurrencyRepository:
    async def find_currency_in_db(self, currency_code: str):
        async with async_session() as db:
            coinbase_api_table_query = select(CurrencyInfoModel).filter(
                CurrencyInfoModel.currency_code == currency_code
            )
            result = await db.execute(coinbase_api_table_query)
            return result.first()

    async def find_currency_by_id_in_db(self, currency_id: int):
        async with async_session() as db:
            coinbase_api_table_query = select(CurrencyInfoModel).filter(
                CurrencyInfoModel.id == currency_id
            )
            result = await db.execute(coinbase_api_table_query)
            return result.first()

    async def _find_backed_currency_in_db(self) -> Union[CurrencyDatabase, None]:
        async with async_session() as db:
            coinbase_api_table_query = select(CurrencyInfoModel).filter(
                CurrencyInfoModel.currency_code == self.backed_by
            )
            result = await db.execute(coinbase_api_table_query)
            if result.first() is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Backed currency code {self.backed_by} not found",
                )

    async def read_all(self) -> List:
        async with async_session() as db:
            coinbase_api_table_query = select(
                CurrencyInfoModel.id,
                CurrencyInfoModel.currency_code.label("currency_code"),
                CurrencyInfoModel.rate,
                CurrencyInfoModel.backed_by,
                CurrencyInfoModel.updated_at,
                CurrencyInfoModel.currency_type,
            ).order_by(CurrencyInfoModel.currency_code)
            result = await db.execute(coinbase_api_table_query)
            return result.all()

    async def read(self, currency_id: int):
        async with async_session() as db:
            currency = select(CurrencyInfoModel).filter(
                CurrencyInfoModel.id == currency_id
            )
            result = await db.execute(currency)
            return result.first()

    async def create(self, currency_data) -> int:
        async with async_session() as db:
            currency = CurrencyInfoModel(
                currency_code=currency_data.currency_code,
                rate=currency_data.rate,
                backed_by=currency_data.backed_by,
                updated_at=datetime.now(),
                currency_type=currency_data.currency_type,
            )
            db.add(currency)
            await db.commit()
            await db.refresh(currency)
            return currency

    async def update(self, currency_id, currency_data):
        async with async_session() as db:
            update_currency_db = (
                update(CurrencyInfoModel)
                .where(CurrencyInfoModel.id == currency_id)
                .values(
                    currency_code=currency_data.currency_code,
                    rate=currency_data.rate,
                    backed_by=currency_data.backed_by,
                    updated_at=datetime.now(),
                    currency_type=currency_data.currency_type,
                )
            )
            result = await db.execute(update_currency_db)
            await db.commit()
            return result

    async def delete(self, currency_id):
        async with async_session() as db:
            currency_query = delete(CurrencyInfoModel).where(
                CurrencyInfoModel.id == currency_id
            )
            result = await db.execute(currency_query)
            await db.commit()
            return result
