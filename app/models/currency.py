class CurrencyModel:
    def __init__(self, code, name, description=''):
        self.code = code
        self.name = name
        self.description = description

    def to_dict(self):
        return {
            "name": self.name,
            "code": self.code,
            "description": self.description
        }

    @property
    def value(self, amount):
        pass

    def value_in_other_currency(self, amount, other_currency):
        pass
