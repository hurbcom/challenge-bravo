from fastapi import (
    APIRouter,
    Query,
    status,
)
from fastapi.responses import JSONResponse

from app.api.v1.currency_converter.models import (
    DeleteCurrency,
    NewCurrency,
)
from app.api.v1.currency_converter.utils import return_amount
from app.services.awesomeapi import AwesomeApiService

router = APIRouter(tags=["Currency"])


@router.get(
    path="/currency", response_class=JSONResponse, status_code=status.HTTP_200_OK
)
def get_currency(
    from_: str = Query(alias="from"),
    to: str = Query(),
    amount: float = Query(),
) -> JSONResponse:

    service = AwesomeApiService()
    actual_values = service.get_currency_values(from_, to)
    converted_value = return_amount(from_, to, amount, actual_values)

    return JSONResponse(
        content={"converted_value": converted_value}, status_code=status.HTTP_200_OK
    )


@router.post(
    path="/currency", response_class=JSONResponse, status_code=status.HTTP_200_OK
)
def create_currency(
    payload: NewCurrency,
) -> JSONResponse:

    # Criar um repository para criar novos dados

    return JSONResponse(
        content={"new_currency": ""}, status_code=status.HTTP_200_OK
    )


@router.delete(
    path="/currency", response_class=JSONResponse, status_code=status.HTTP_200_OK
)
def delete_currencys(
    payload: DeleteCurrency,
) -> JSONResponse:

    # Criar um repository para apagar dados

    return JSONResponse(
        content={"deleted_currency": ""}, status_code=status.HTTP_200_OK
    )
