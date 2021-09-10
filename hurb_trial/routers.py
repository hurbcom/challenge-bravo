from exceptions import (
    ExchangeGenericException,
    NotFoundException,
    AlreadyExistsException,
)
from schemas import ExchangedCurrencySchema
from typing import List
from services import CurrencyExchangeService
from starlette.responses import JSONResponse
from schemas import (
    custom_currency_pydantic,
    custom_currency_pydantic_create,
    custom_currency_pydantic_upd,
)
from models import CustomCurrency
from fastapi import APIRouter
from tortoise.exceptions import IntegrityError
from requests.exceptions import HTTPError

router = APIRouter(prefix="/custom-currencies", tags=["CustomCurrency"])


@router.get("", response_model=List[custom_currency_pydantic])
async def get_all():
    return await custom_currency_pydantic.from_queryset(CustomCurrency.all())


@router.get("/{cc_id}", response_model=custom_currency_pydantic)
async def get_one(cc_id: int):
    return await custom_currency_pydantic.from_queryset_single(
        CustomCurrency.get(id=cc_id)
    )


@router.post("", response_model=custom_currency_pydantic_create)
async def create(custom_currency: custom_currency_pydantic_create):
    try:
        return await custom_currency_pydantic_create.from_tortoise_orm(
            await CustomCurrency.create(
                **custom_currency.dict(exclude_unset=True)
            )
        )
    except IntegrityError:
        raise AlreadyExistsException(obj_name="Currency")


@router.put("/{cc_id}", response_model=custom_currency_pydantic_upd)
async def update(cc_id: int, custom_currency: custom_currency_pydantic_upd):
    await CustomCurrency.filter(id=cc_id).update(
        **custom_currency.dict(exclude_unset=True)
    )

    return await custom_currency_pydantic_upd.from_queryset_single(
        CustomCurrency.get(id=cc_id)
    )


@router.delete("/{cc_id}", response_model=None)
async def delete(cc_id: int):
    deleted = await CustomCurrency.filter(id=cc_id).delete()

    if not deleted:
        raise NotFoundException(obj_name="Currency")
    return JSONResponse(status_code=200)


@router.get(
    "/exchange/", response_model=ExchangedCurrencySchema, status_code=200
)
async def exchange(from_currency: str, to_currency: str, value: float):
    try:
        service_class = CurrencyExchangeService(
            from_currency.upper(), to_currency.upper(), value
        )
        data = await service_class.get_currency_data()
    except HTTPError:
        raise ExchangeGenericException(from_currency, to_currency)

    return data
