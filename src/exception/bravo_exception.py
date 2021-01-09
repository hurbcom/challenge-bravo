from typing import Dict
from json import dumps

from flask import Response


class BravoException(Exception):
    def __init__(self, error: Dict, http_status: int = 400):
        Exception.__init__(self, error)
        self._error = {"error": error}
        self._http_status = http_status

    @property
    def http_response(self):
        return Response(
            dumps(self._error),
            self._http_status,
            content_type="application/json",
        )
