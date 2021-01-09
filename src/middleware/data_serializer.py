from typing import Dict
from json import dumps
from flask import Response
from mongoengine import Document
from bson import json_util

from exception import BravoException, GEE004


def build_response(data, http_status: int = 200):
    if isinstance(data, Document):
        res = dumps(data.to_mongo().to_dict(), default=json_util.default)
    elif isinstance(data, Dict):
        res = dumps(data)
    else:
        res = None

    if not res:
        return BravoException(GEE004).http_response

    return Response(res, status=http_status, content_type="application/json")
