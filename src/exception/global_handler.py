import traceback
from flask import Flask
from werkzeug.exceptions import HTTPException

from .bravo_exception import BravoException
from .general_errors import GEE001, GEE002


def global_exception_handler(app: Flask):
    @app.errorhandler(Exception)
    def func(ex):
        app.logger.exception(traceback.format_exc())
        if isinstance(ex, HTTPException):
            new_ex = BravoException(GEE002)
        elif isinstance(ex, BravoException):
            new_ex = ex
        else:
            new_ex = BravoException(GEE001, http_status=500)

        return new_ex.http_response
