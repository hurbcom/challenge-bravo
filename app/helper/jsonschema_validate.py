from jsonschema import Draft7Validator, FormatChecker


class JSONSchemaValidator():
    def __init__(self):
        self._schema = {}

    @property
    def schema(self):
        return self._schema

    @schema.setter
    def schema(self, value):
        self._schema = Draft7Validator(value, format_checker=FormatChecker())

    def validate(self, data):
        errors = list(self.schema.iter_errors(data))

        if not errors:
            return True, []
        else:
            messages = [error.message for error in errors]
            return False, messages
