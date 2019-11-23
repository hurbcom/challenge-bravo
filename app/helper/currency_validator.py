from helper.jsonschema_validate import JSONSchemaValidator


class CurrencyValidator(JSONSchemaValidator):
    def __init__(self):
        self.schema = {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "description": "Contract to add a new currency entity.",
            "type": "object",
            "properties": {
                "code": {
                    "type": "string",
                    "pattern": "^[A-Z]{3,5}$"
                },
                "name": {
                    "type": "string"
                },
                "description": {
                    "type": ["string", "null"]
                }
            },
            "required": ["code", "name"]
        }
