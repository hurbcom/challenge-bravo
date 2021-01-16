from typing import Dict, Optional

from .constant import DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE


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
