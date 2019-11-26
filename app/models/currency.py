class CurrencyModel:
    def __init__(self, code, name, description=''):
        self.code = code
        self.name = name
        self.description = description
        self.value = float()

    def to_dict(self):
        return {
            "name": self.name,
            "code": self.code,
            "description": self.description
        }
