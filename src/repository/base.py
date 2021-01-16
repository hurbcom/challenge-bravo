from typing import Dict


class BaseRepository:
    def __init__(self, model_cls):
        self._model = model_cls

    def create(self, data: Dict):
        model_obj = self._model(**data)
        return model_obj.save()

    def get_by_id(self, data_id: str):
        return self._model.objects(id=data_id).first()

    def list_all(self, page_number: int, page_size: int):
        offset = 0 if page_number < 1 else (page_number - 1) * page_size
        return self._model.objects().skip(offset).limit(page_size)
