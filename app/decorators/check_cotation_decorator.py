from datetime import datetime
from functools import wraps
from typing import Callable

from app.classes.app_with_db import current_app


def check_cotation(controller: Callable) -> Callable:
    """
    Verifies if registered cotation is up to date in database and sets
    the `app.cotation_is_updated` to relative bollean.
    """

    @wraps(controller)
    def wrapper(*args, **kwargs) -> Callable:
        now = datetime.now()
        cotation = current_app.cotation
        updated = True

        if cotation:
            diff = now - current_app.cotation.updated_at
            updated = diff.total_seconds() < 60

        current_app.cotation_is_updated = updated

        return controller(*args, **kwargs)

    return wrapper
