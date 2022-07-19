from werkzeug.exceptions import BadRequest


class InvalidValueTypesError(BadRequest):
    description: dict
    code: int

    def __init__(self, error_msg: str, extra_fields: dict, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.description = {"error": error_msg, **extra_fields}
