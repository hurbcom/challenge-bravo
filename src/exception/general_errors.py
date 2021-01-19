from typing import Dict
from json import dumps

GEE001 = {"code": "GEE001", "msg": "Unexpected error"}

GEE002 = {"code": "GEE002", "msg": "Unexpected HTTP error"}

GEE003 = {"code": "GEE003", "msg": "HTTP method not allowed"}

GEE004 = {"code": "GEE004", "msg": "Error while serializing data"}


def GEE005(errors: Dict):
    return {"code": "GEE005", "msg": f"The request payload is invalid: {dumps(errors)}"}


GEE006 = {"code": "GEE006", "msg": "Route not found"}
