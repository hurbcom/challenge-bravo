from typing import Dict
from repository import BaseRepository


class BaseService:
    def __init__(self, repository: BaseRepository):
        self._repository = repository

    def get_by_id(self, data_id: str):
        if not data_id:
            return None
        return self._repository.get_by_id(data_id)

    def add(self, data: Dict):
        return self._repository.add(data)
