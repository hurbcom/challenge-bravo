from typing import Dict


class BaseRepository:
    def __init__(self, model_cls):
        self._model = model_cls

    def get_by_id(self, data_id: str):
        return self._model.objects(id=data_id).first()

    def add(self, data: Dict):
        model_obj = self._model(**data)
        return model_obj.save()
