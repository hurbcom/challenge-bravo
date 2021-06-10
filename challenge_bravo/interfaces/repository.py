from abc import ABC, abstractmethod


class Repository(ABC):

    @abstractmethod
    def add_to_collection(self, object_id):
        ...

    @abstractmethod
    def remove_from_collection(self, object_id):
        ...
    @abstractmethod
    def get_from_collection(self, object_id=None):
        pass
