class ErrorUtils():
    __errors = dict([
        # Error genéricos
        (100, 'INVALID REQUEST'),
        (101, 'ACCESS DENIED'),
        (102, 'FINANCIAL PROBLEM'),
        (998, 'INTERNAL SERVER ERROR')
    ])

    @staticmethod
    def get_message(id):
        if id in ErrorUtils.__errors:
            return ErrorUtils.__errors.get(id)
        else:
            return "UNEXPECTED ERROR. PLEASE CONTACT US AT {g6almeida@hotmail.com}"
