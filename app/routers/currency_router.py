from fastapi import APIRouter, status

from app.schemas.currency import CurrencyInput, MultipleCurrencyResponse
from app.services.currency_service import CurrencyService

router = APIRouter(prefix="/currency", tags=["Currency"])
currency = CurrencyService()


@router.get(
    "/", status_code=status.HTTP_200_OK, response_model=MultipleCurrencyResponse
)
async def read_all_currencies() -> MultipleCurrencyResponse:
    currency_list = await currency.get_currencies()
    return MultipleCurrencyResponse(data=currency_list)


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_currency(currency_data: CurrencyInput):
    return await currency.create_currency(currency_data)


@router.get("/{currency_id}", status_code=status.HTTP_200_OK)
async def read_currency(currency_id: int):
    return await currency.get_currency(currency_id)


@router.put("/{currency_id}", status_code=status.HTTP_200_OK)
async def update_currency(
    currency_id: int, currency_data: CurrencyInput):
    return await currency.update_currency(currency_id, currency_data)


@router.delete("/{currency_id}", status_code=status.HTTP_200_OK)
async def delete_currency(currency_id: int):
    return await currency.delete_currency(currency_id)
