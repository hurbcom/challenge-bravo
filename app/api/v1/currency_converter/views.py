import logging

from fastapi import (
    APIRouter,
    Query,
    status,
)
from fastapi.responses import JSONResponse

from app.api.v1.currency_converter.exceptions import GenericApiException
from app.api.v1.currency_converter.models import (
    Currency,
    DeleteCurrencyByAcronym,
    DeleteCurrencyById,
)
from app.api.v1.currency_converter.service import CurrencyConverterService
from app.exceptions.default_exceptions import DefaultApiException

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Currency"])


@router.get(
    path="/currency", response_class=JSONResponse, status_code=status.HTTP_200_OK
)
def get_currency(
    from_: str = Query(alias="from"),
    to: str = Query(),
    amount: float = Query(),
) -> JSONResponse:
    """
    Return the value of the amount of a conversion between one currency and another
    """
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
        logger.error("Unmapped error", extra={"error": error})
        raise GenericApiException()


@router.get(
    path="/currency/get-by-acronym",
    response_class=JSONResponse,
    status_code=status.HTTP_200_OK,
)
def get_currency_by_acronym(acronym: str = Query()) -> JSONResponse:
    """
    Returns the currency we created in our database by they name
    """
    service = CurrencyConverterService()
    try:
        if response := service.get_currency_by_acronym(acronym):
            return JSONResponse(content=response, status_code=status.HTTP_200_OK)
        return JSONResponse(content={}, status_code=status.HTTP_404_NOT_FOUND)
    except Exception as error:
        logger.error("Unmapped error", extra={"error": error})
        raise GenericApiException()


@router.get(
    path="/currency/get-all-currency",
    response_class=JSONResponse,
    status_code=status.HTTP_200_OK,
)
def get_all_currency() -> JSONResponse:
    """
    Returns all the currencys we created in our database
    """
    service = CurrencyConverterService()
    try:
        if response := service.get_all_currency():
            return JSONResponse(content=response, status_code=status.HTTP_200_OK)
    except Exception as error:
        logger.error("Unmapped error", extra={"error": error})
        raise GenericApiException()


@router.post(
    path="/currency", response_class=JSONResponse, status_code=status.HTTP_200_OK
)
def create_currency(
    payload: Currency,
) -> JSONResponse:
    """
    Create a currency in our database
    """
    service = CurrencyConverterService()
    try:
        id = service.create_currency(payload)
    except DefaultApiException as error:
        raise error
    except Exception as error:
        logger.error("Unmapped error", extra={"error": error})
        raise GenericApiException()
    return JSONResponse(content={"id": id}, status_code=status.HTTP_201_CREATED)


@router.delete(
    path="/currency", response_class=JSONResponse, status_code=status.HTTP_200_OK
)
def delete_currency(
    payload: DeleteCurrencyById,
) -> JSONResponse:

    service = CurrencyConverterService()
    try:
        id = service.delete_currency(payload.id)
    except DefaultApiException as error:
        raise error
    except Exception as error:
        logger.error("Unmapped error", extra={"error": error})
        raise GenericApiException()
    return JSONResponse(content={"id": id}, status_code=status.HTTP_200_OK)


@router.delete(
    path="/currency/by_acronym",
    response_class=JSONResponse,
    status_code=status.HTTP_200_OK,
)
def delete_currency_by_acronym(
    payload: DeleteCurrencyByAcronym,
) -> JSONResponse:

    service = CurrencyConverterService()
    try:
        acronym = service.delete_currency_by_acronym(payload.acronym)
    except DefaultApiException as error:
        raise error
    except Exception as error:
        logger.error("Unmapped error", extra={"error": error})
        raise GenericApiException()
    return JSONResponse(content={"acronym": acronym}, status_code=status.HTTP_200_OK)
