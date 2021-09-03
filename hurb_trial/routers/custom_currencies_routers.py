from typing import List
from fastapi.exceptions import HTTPException

from starlette.responses import JSONResponse
from schemas import (
    custom_currency_pydantic,
    custom_currency_pydantic_create,
    custom_currency_pydantic_upd,
)
from models import CustomCurrency
from fastapi import APIRouter
from tortoise.exceptions import IntegrityError

router = APIRouter(prefix="/custom-currencies", tags=["CustomCurrency"])


@router.get("", response_model=List[custom_currency_pydantic])
async def get_all():
    return await custom_currency_pydantic.from_queryset(CustomCurrency.all())


@router.get("/{cc_id}", response_model=custom_currency_pydantic)
async def get_one(cc_id: str):
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
        raise HTTPException(
            status_code=400, detail="This currency already exists"
        )


@router.put("/{cc_id}", response_model=custom_currency_pydantic_upd)
async def update(cc_id: str, custom_currency: custom_currency_pydantic_upd):
    await CustomCurrency.filter(id=cc_id).update(
        **custom_currency.dict(exclude_unset=True)
    )

    return await custom_currency_pydantic_upd.from_queryset_single(
        CustomCurrency.get(id=cc_id)
    )


@router.delete("/{cc_id}", response_model=None)
async def delete(cc_id: str):
    deleted = await CustomCurrency.filter(id=cc_id).delete()

    if not deleted:
        return HTTPException(status_code=404, detail="User not found")
    return JSONResponse(status_code=200)
