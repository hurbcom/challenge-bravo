import re
from typing import Dict, Callable, List
from json import dumps, loads, JSONEncoder
from datetime import date, datetime
from flask import Response
from mongoengine.base import BaseDocument
from bson import ObjectId
from bson.json_util import default

from exception import BravoException, GEE004


under_pat = re.compile(r"_([a-z])")


def underscore_to_camel(name: str) -> str:
    if name == "_id":
        return "id"
    return under_pat.sub(lambda x: x.group(1).upper(), name)


def convert_json(d: Dict, convert: Callable) -> Dict:
    new_d = {}
    for k, v in d.items():
        if isinstance(v, list):
            new_v = []
            for item in v:
                new_v.append(convert_json(item, convert))
            new_d[convert(k)] = new_v
        else:
            new_d[convert(k)] = convert_json(v, convert) if isinstance(v, dict) else v
    return new_d


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
