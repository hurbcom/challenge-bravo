class ConversionError(Exception):
    def __init__(self, message):
        self.message = message


class MissingParameterError(ConversionError):
    pass


class UnableToFindCurrencyError(ConversionError):
    pass
