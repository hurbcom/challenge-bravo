from typing import Dict


class BaseRepository:
    def __init__(self, model_cls):
        self._model = model_cls

    def create(self, data: Dict):
        model_obj = self._model(**data)
        return model_obj.save()

    def get_by_id(self, data_id: str):
        return self._model.objects(id=data_id).first()

    def list_all(self, page_number: int, page_size: int, ordering: str = None):
        offset = 0 if page_number < 1 else (page_number - 1) * page_size
        qs = self._model.objects()
        if ordering:
            qs = qs.order_by(ordering)
        return qs.skip(offset).limit(page_size)

    def delete_by_id(self, data_id: str):
        model_obj = self.get_by_id(data_id)
        if model_obj:
            model_obj.delete()
