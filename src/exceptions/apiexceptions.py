class InvalidParametersException(Exception):
    def __init__(self,):
        self.statusCode = 400
        self.message = 'Parametros invalidos'