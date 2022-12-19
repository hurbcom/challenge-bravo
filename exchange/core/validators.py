class QueryParamsValidator:
    def __init__(self, query_params):
        self.from_ = query_params.get('from')
        self.to = query_params.get('to')
        self.amount = query_params.get('amount')
        self.errors = []

    def is_valid(self):
        """Validates the query params sent from request.

        : return bool
        """
        if not self.from_:
            self.errors.append({'from_': 'This field may not be blank.'})

        if not self.to:
            self.errors.append({'to': 'This field may not be blank.'})

        if not self.amount:
            self.errors.append({'amount': 'This field may not be blank.'})
        elif not self._amount_is_float():
            self.errors.append({'amount': 'A valid number is required.'})

        if self.errors:
            return False

        return True

    def _amount_is_float(self):
        """Checks if is float and transform into it.

        : return bool
        """
        try:
            self.amount = float(self.amount)
            return True
        except:
            return False
