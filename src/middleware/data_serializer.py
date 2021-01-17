from typing import Dict, List
from json import dumps, loads, JSONEncoder
from datetime import date, datetime
from flask import Response
from mongoengine.base import BaseDocument
from bson import ObjectId
from bson.json_util import default

from common import underscore_to_camel, convert_json
from exception import BravoException, GEE004


class CustomEncoder(JSONEncoder):
    def default(self, obj, **kwargs):
        if isinstance(obj, BaseDocument):
            return obj.to_mongo().to_dict()
        elif isinstance(obj, ObjectId):
            return str(obj)
        elif isinstance(obj, datetime):
            return obj.strftime("%Y-%m-%d %H:%M:%S")
        elif isinstance(obj, date):
            return obj.strftime("%Y-%m-%d")
        return default(obj)


def serialize_data(data: [BaseDocument, Dict, List]) -> [Dict, List]:
    if isinstance(data, list):
        new_data = []
        for d in data:
            new_data.append(serialize_data(d))
    else:
        new_data = convert_json(data, underscore_to_camel)

    return new_data


def build_response(
    data: [BaseDocument, Dict, List], http_status: int = 200
) -> Response:
    new_data = dumps(data, cls=CustomEncoder)
    res = dumps(serialize_data(loads(new_data)))

    if not res:
        return BravoException(GEE004).http_response

    return Response(res, status=http_status, content_type="application/json")
