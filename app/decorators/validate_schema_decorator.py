from functools import wraps
from typing import Callable, Type

from flask import Response, request
from marshmallow import Schema

from app.classes.app_with_db import current_app


def validate_schema(schema: Type[Schema]):
    """
    Validates `request.data` using passed schema.
    Sets `app.validated_data`.
    """

    def inner(controller: Callable) -> Callable:
        @wraps(controller)
        def wrapper(*args, **kwargs) -> tuple[Response, int]:
            serialized: dict = schema().load(request.json)
            current_app.validated_data = serialized

            return controller(*args, **kwargs)

        return wrapper

    return inner
