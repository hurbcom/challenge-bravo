class InvalidParametersException(Exception):
    def __init__(self):
        self.statusCode = 400
        self.message = 'Parametros invalidos'

class InvalidCurrenciesException(Exception):
    def __init__(self):
        self.statusCode = 404
        self.message = 'Moedas nao inseridas'

class DatabaseException(Exception):
    def __init__(self):
        self.statusCode = 500
        self.message = 'Nao foi possível inserir moeda'
