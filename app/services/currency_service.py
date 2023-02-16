from fastapi import HTTPException, status

from app.repositories.currency_repository import CurrencyRepository


class CurrencyService:
    def __init__(self):
        self.repository = CurrencyRepository()

    async def get_currencies(self) -> list:
        result = await self.repository.read_all()
        if result is []:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No currencies found",
            )
        return result

    async def create_currency(self, currency_data) -> int:
        validate = await self.repository.find_currency_in_db(
            currency_data.currency_code, 
        )
        if validate is None:
            currency_id = await self.repository.create(currency_data)
            return {"id": currency_id}
        else:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Currency code {currency_data.currency_code} already exists",
            )

    async def validate_by_id(self, currency_id, ) -> bool:
        result = await self.repository.find_currency_by_id_in_db(currency_id)
        if result is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Backed currency code {currency_id} not found",
            )
        return True

    async def get_currency(self, currency_id):
        await self.validate_by_id(currency_id)
        result = await self.repository.read(currency_id)
        if result is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Currency code {currency_id} not found",
            )
        return result

    async def update_currency(self, currency_id, currency_data):
        await self.validate_by_id(currency_id)
        await self.repository.update(currency_id, currency_data)
        return {"message": "Currency updated successfully"}

    async def delete_currency(self, currency_id):
        await self.validate_by_id(currency_id)
        await self.repository.delete(currency_id)
        return {"message": "Currency deleted successfully"}
