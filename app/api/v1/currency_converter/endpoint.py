from fastapi import (
    APIRouter,
    Query,
    status,
)
from fastapi.responses import JSONResponse

from app.api.v1.currency_converter.exceptions import GenericApiException
from app.api.v1.currency_converter.models import (
    Currency,
    DeleteCurrencyById,
    DeleteCurrencyByName,
)
from app.api.v1.currency_converter.service import CurrencyConverterService
from app.exceptions.default_exceptions import DefaultApiException

router = APIRouter(tags=["Currency"])


@router.get(
    path="/currency", response_class=JSONResponse, status_code=status.HTTP_200_OK
)
def get_currency(
    from_: str = Query(alias="from"),
    to: str = Query(),
    amount: float = Query(),
) -> JSONResponse:

    # Always leaving the values ​​in upper case.
    from_, to = from_.upper(), to.upper()
    service = CurrencyConverterService()
    try:
        converted_value = service.get_currency(from_, to, amount)
        return JSONResponse(
            content={"converted_value": converted_value}, status_code=status.HTTP_200_OK
        )
    except DefaultApiException as error:
        raise error
    except Exception as error:
        raise GenericApiException()


@router.get(
    path="/currency/get-by-acronym",
    response_class=JSONResponse,
    status_code=status.HTTP_200_OK,
)
def get_currency_by_acronym(acronym: str = Query()) -> JSONResponse:
    service = CurrencyConverterService()
    try:
        if response := service.get_currency_by_acronym(acronym):
            return JSONResponse(content=response, status_code=status.HTTP_200_OK)
        return JSONResponse(content={}, status_code=status.HTTP_404_NOT_FOUND)
    except DefaultApiException as error:
        raise error
    except Exception as error:
        raise GenericApiException()


@router.post(
    path="/currency", response_class=JSONResponse, status_code=status.HTTP_200_OK
)
def create_currency(
    payload: Currency,
) -> JSONResponse:
    service = CurrencyConverterService()
    try:
        id = service.create_currency(payload)
    except DefaultApiException as error:
        raise error
    except Exception as error:
        raise GenericApiException()
    return JSONResponse(content={"id": id}, status_code=status.HTTP_200_OK)


@router.delete(
    path="/currency", response_class=JSONResponse, status_code=status.HTTP_200_OK
)
def delete_currency(
    payload: DeleteCurrencyById,
) -> JSONResponse:

    service = CurrencyConverterService()
    try:
        id = service.delete_currency(payload)
    except DefaultApiException as error:
        raise error
    except Exception as error:
        raise GenericApiException()
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
    try:
        id = service.delete_currency_by_name(payload)
    except DefaultApiException as error:
        raise error
    except Exception as error:
        raise GenericApiException()
    return JSONResponse(content={"id": id}, status_code=status.HTTP_200_OK)
