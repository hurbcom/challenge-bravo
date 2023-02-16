from sqlalchemy import select

from app.models.database import async_session
from app.models.models import CurrencyInfoModel, CurrencyInfoModel


class ConvertRepository:
    async def find_currency_in_db(self, currency_code: str):
        async with async_session() as db:
            coinbase_api_table_query = select([CurrencyInfoModel.rate]).filter(
                CurrencyInfoModel.currency_code == currency_code
            )
            result = await db.execute(coinbase_api_table_query)
            return result.first()

    async def find_currency_backed_by(self, backed_by: str):
        async with async_session() as db:
            coinbase_api_table_query = select(
                [CurrencyInfoModel.rate]
            ).filter(CurrencyInfoModel.currency_code == backed_by)
            result = await db.execute(coinbase_api_table_query)
            return result.first()
