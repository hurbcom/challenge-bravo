class MongoError(Exception):
    def __init__(self, message):
        self.message = message


class NoMatchedCurrency(MongoError):
    pass
