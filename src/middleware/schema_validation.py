from functools import wraps
from typing import Dict
from flask import request

from exception import BravoException, GEE003, GEE005
from validation import is_valid


def validate_request(validation_schema: Dict):
    def wrapper(f):
        @wraps(f)
        def func(*args, **kwargs):
            http_method = request.method

            query_args = dict(request.args)
            body = request.get_json(silent=True)

            if http_method in ["GET"]:
                data = query_args
            elif http_method in ["POST", "PUT", "PATCH", "DELETE"]:
                data = body
                if http_method == "DELETE" and query_args and not body:
                    data = query_args
            else:
                raise BravoException(GEE003)

            errors = is_valid(schema=validation_schema, data=data)
            if errors:
                raise BravoException(GEE005(errors))
            return f(*args, **kwargs)

        return func

    return wrapper
