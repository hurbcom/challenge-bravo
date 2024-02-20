from typing import (
    Any,
    Dict,
)

from app.exceptions.default_exceptions import DefaultApiException


class GenericApiException(DefaultApiException):
    def __init__(
        self,
        status_code: int = 500,
        detail: Any = {"error": "Some error ocurred!"},
        headers: Dict[str, str] | None = None,
    ) -> None:
        super().__init__(status_code, detail, headers)
