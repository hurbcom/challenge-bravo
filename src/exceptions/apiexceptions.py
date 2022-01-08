class AbstractException(Exception):
    pass
class InvalidParametersException(AbstractException):
    def __init__(self,):
        self.statusCode = 400
        self.message = 'Parametros invalidos'

class InvalidCurrenciesException(AbstractException):
    def __init__(self,):
        self.statusCode = 404
        self.message = 'Moedas nao inseridas'