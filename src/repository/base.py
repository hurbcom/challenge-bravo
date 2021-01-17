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
        qs = self._model.objects()
        if ordering:
            qs = qs.order_by(ordering)

        total_items = qs.count()
        next_page = total_items > page_number * page_size

        offset = 0 if page_number < 1 else (page_number - 1) * page_size

        items = list(qs.skip(offset).limit(page_size))

        return {"items": items, "total_items": total_items, "next_page": next_page}

    def update_by_id(self, data_id: str, data: Dict):
        model_obj = self.get_by_id(data_id)
        if model_obj:
            model_obj_dict = model_obj.to_mongo().to_dict()
            model_obj_dict["id"] = model_obj_dict["_id"]
            del model_obj_dict["_id"]
            return self._model(**{**model_obj_dict, **data}).save()
        return model_obj

    def delete_by_id(self, data_id: str):
        model_obj = self.get_by_id(data_id)
        if model_obj:
            model_obj.delete()
            return data_id
        return model_obj
