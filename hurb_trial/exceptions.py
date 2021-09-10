from typing import Optional, Dict, Any
from fastapi.exceptions import HTTPException


class ExchangeGenericException(HTTPException):
    def __init__(
        self,
        from_currency,
        to_currency,
        headers: Optional[Dict[str, Any]] = None,
    ) -> None:
        msg = f"Exchange {from_currency}-{to_currency} could not be completed. Verify the currencies and try again."

        super().__init__(400, detail=msg, headers=headers)


class NotFoundException(HTTPException):
    def __init__(
        self,
        obj_name: str,
        headers: Optional[Dict[str, Any]] = None,
    ) -> None:
        msg = f"{obj_name} not found"

        super().__init__(404, detail=msg, headers=headers)


class AlreadyExistsException(HTTPException):
    def __init__(
        self,
        obj_name: str,
        headers: Optional[Dict[str, Any]] = None,
    ) -> None:
        msg = f"The {obj_name} already exists"

        super().__init__(400, detail=msg, headers=headers)
