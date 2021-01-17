import re
from typing import Dict, Optional, Callable

from .constant import DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE


under_pat = re.compile(r"_([a-z])")
camel_pat = re.compile(r"([A-Z])")


def get_pagination(data: Dict) -> (Optional[int], Optional[int]):
    page_number = data.get("pageNumber")
    page_size = data.get("pageSize")

    try:
        new_page_number = int(page_number)
    except (ValueError, TypeError):
        new_page_number = None

    try:
        new_page_size = int(page_size)
    except (ValueError, TypeError):
        new_page_size = None

    new_page_number = new_page_number if new_page_number else DEFAULT_PAGE_NUMBER
    new_page_size = new_page_size if new_page_size else DEFAULT_PAGE_SIZE

    return new_page_number, new_page_size


def underscore_to_camel(name: str) -> str:
    if name == "_id":
        return "id"
    return under_pat.sub(lambda x: x.group(1).upper(), name)


def camel_to_underscore(name: str) -> str:
    return camel_pat.sub(lambda x: "_" + x.group(1).lower(), name)


def camel_dict_keys_to_underscore(data: Dict) -> Dict:
    if not data:
        return {}

    new_d = {}
    for k, v in data.items():
        new_d[camel_to_underscore(k)] = v
    return new_d


def convert_json(data: Dict, convert: Callable) -> Dict:
    new_d = {}
    for k, v in data.items():
        if isinstance(v, list):
            new_v = []
            for item in v:
                new_v.append(convert_json(item, convert))
            new_d[convert(k)] = new_v
        else:
            new_d[convert(k)] = convert_json(v, convert) if isinstance(v, dict) else v
    return new_d
