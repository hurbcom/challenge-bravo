"""Module to help with aspects that isn't on other modules contexts."""


class Singleton(type):
    """Class mother to any other that will work as a Singleton."""
    def __init__(self, name, bases, attrs, **kwargs):
        super().__init__(name, bases, attrs)
        self._instance = None

    def __call__(self, *args, **kwargs):
        if self._instance is None:
            self._instance = super().__call__(*args, **kwargs)
        return self._instance
