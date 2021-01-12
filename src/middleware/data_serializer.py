from json import dumps, JSONEncoder
from datetime import date, datetime
from flask import Response
from mongoengine import Document
from bson import ObjectId
from bson.json_util import default

from exception import BravoException, GEE004


class CustomEncoder(JSONEncoder):
    def default(self, obj, **kwargs):
        if isinstance(obj, Document):
            return obj.to_mongo()
        elif isinstance(obj, ObjectId):
            return str(obj)
        elif isinstance(obj, datetime):
            return obj.strftime("%Y-%m-%d %H:%M:%S")
        elif isinstance(obj, date):
            return obj.strftime("%Y-%m-%d")
        return default(obj)


def build_response(data, http_status: int = 200) -> Response:
    res = dumps(data, cls=CustomEncoder)

    if not res:
        return BravoException(GEE004).http_response

    return Response(res, status=http_status, content_type="application/json")
