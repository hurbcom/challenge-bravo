import datetime
from typing import Tuple

from fastapi import HTTPException, status

from app.repositories.convert_repository import ConvertRepository
from app.schemas.convert import OutputConversionSchema


class ConvertOperator:
    def __init__(self):
        self.repository = ConvertRepository()

    async def get_currency(self, currency_code: str) -> Tuple[str, float]:
        currency = await self.repository.find_currency_in_db(currency_code)
        if currency is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Currency code {currency_code} not found",
            )
        return currency

    async def get_backed_currency(self, backed_by: str) -> Tuple[str, float]:
        currency = await self.repository.find_currency_backed_by(backed_by)
        if currency is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Backed currency code {backed_by} not found",
            )
        return currency

    async def convert_currencies(self, params) -> OutputConversionSchema:
        from_currency_rate = await self.get_currency(params.from_this)
        to_currency_rate = await self.get_backed_currency(params.to)
        from_currency_rate = from_currency_rate[0]
        to_currency_rate = to_currency_rate[0]

        converted_value = params.amount * from_currency_rate / to_currency_rate

        return OutputConversionSchema(
            from_this=params.from_this,
            to=params.to,
            amount=params.amount,
            converted_value=round(converted_value, 2),
            updated_at=datetime.datetime.now(),
        )
