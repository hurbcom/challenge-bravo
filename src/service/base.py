from typing import Dict
from repository import BaseRepository


class BaseService:
    def __init__(self, repository: BaseRepository):
        self._repository = repository

    def create(self, data: Dict):
        return self._repository.create(data)

    def get_by_id(self, data_id: str):
        if not data_id:
            return None
        return self._repository.get_by_id(data_id)

    def list_all(self, page_number: int, page_size: int, ordering: str = None):
        return self._repository.list_all(page_number, page_size, ordering)
