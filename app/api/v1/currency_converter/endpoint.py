from fastapi import (
    APIRouter,
    Query,
    status,
)
from fastapi.responses import JSONResponse

from app.api.v1.currency_converter.models import (
    Currency,
    DeleteCurrencyById,
    DeleteCurrencyByName,
)
from app.api.v1.currency_converter.service import CurrencyConverterService

router = APIRouter(tags=["Currency"])


@router.get(
    path="/currency", response_class=JSONResponse, status_code=status.HTTP_200_OK
)
def get_currency(
    from_: str = Query(alias="from"),
    to: str = Query(),
    amount: float = Query(),
) -> JSONResponse:

    service = CurrencyConverterService(from_, to, amount)
    try:
        converted_value = service.get_currency()
        return JSONResponse(
            content={"converted_value": converted_value}, status_code=status.HTTP_200_OK
        )
    except Exception:
        raise ValueError


@router.get(
    path="/currency/get-by-acronym",
    response_class=JSONResponse,
    status_code=status.HTTP_200_OK,
)
def get_currency_by_acronym(acronym: str = Query()) -> JSONResponse:

    service = CurrencyConverterService()
    if response := service.get_currency_by_acronym(acronym):
        return JSONResponse(content=response, status_code=status.HTTP_200_OK)
    return JSONResponse(content={}, status_code=status.HTTP_404_NOT_FOUND)


@router.post(
    path="/currency", response_class=JSONResponse, status_code=status.HTTP_200_OK
)
def create_currency(
    payload: Currency,
) -> JSONResponse:

    service = CurrencyConverterService()
    id = service.create_currency(payload)
    return JSONResponse(content={"id": id}, status_code=status.HTTP_200_OK)


@router.delete(
    path="/currency", response_class=JSONResponse, status_code=status.HTTP_200_OK
)
def delete_currency(
    payload: DeleteCurrencyById,
) -> JSONResponse:

    service = CurrencyConverterService()
    id = service.delete_currency(payload)
    return JSONResponse(content={"id": id}, status_code=status.HTTP_200_OK)


@router.delete(
    path="/currency/by_name",
    response_class=JSONResponse,
    status_code=status.HTTP_200_OK,
)
def delete_currency_by_name(
    payload: DeleteCurrencyByName,
) -> JSONResponse:

    service = CurrencyConverterService()
    id = service.delete_currency_by_name(payload)
    return JSONResponse(content={"id": id}, status_code=status.HTTP_200_OK)
