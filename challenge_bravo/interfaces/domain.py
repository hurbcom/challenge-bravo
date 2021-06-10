from abc import ABC, abstractmethod


class Domain(ABC):
    @staticmethod
    @abstractmethod
    def validation_schema(self, *args, **kwargs):
        ...

    @abstractmethod
    def to_item(self, *args, **kwargs):
        ...

    @abstractmethod
    def validate(self, *args, **kwargs):
        ...

    def sanitize(self, payload):
        ...
