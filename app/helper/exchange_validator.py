from helper.jsonschema_validate import JSONSchemaValidator


class ExchangeValidator(JSONSchemaValidator):
    def __init__(self):
        self.schema = {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "description": "Schema of exchange/convert currencies.",
            "type": "object",
            "properties": {
                "from": {
                    "type": "string",
                    "pattern": "^[A-Z]{3}$"
                },
                "to": {
                    "type": "string",
                    "pattern": "^[A-Z]{3}$"
                },
                "amount": {
                    "type": "number",
                    "minimum": 0
                }
            },
            "required": ["from", "to"]
        }

    def validate(self, parameters):
        amount = parameters.get('amount')
        success, report = self._validate_amount_as_string(amount)

        if not success:
            return False, report

        parameters['amount'] = float(parameters['amount'])
        return super().validate(parameters)

    def _validate_amount_as_string(self, amount):
        if not amount:
            return False, ["'amount' is a required parameter"]
        try:
            float(amount)
            return True, None
        except ValueError:
            return False, [f"Could not convert '{amount}' to numeric"]
