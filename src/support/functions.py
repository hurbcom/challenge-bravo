import os
from dotenv import load_dotenv
from datetime import datetime

timestamp_formats = {
    "iso": "%Y-%m-%dT%H:%M:%S.%f",
    "british": "%d/%m/%Y %H:%M:%S",
    "american": "%m/%d/%Y %H:%M:%S",
    "utc": "%Y-%m-%dT%H:%M:%S.%fZ",
    "local": "%Y-%m-%dT%H:%M:%S.%f"
}


class Functions:

    @staticmethod
    def load_all_environment_variables():
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        stage_config = {
            "local": "configmap-local.env",
            "dev": "configmap-dev.env",
            "hmg": "configmap-hmg.env",
            "prd": "configmap-prd.env"
        }

        dotenv_config = {
            "local": True,
            "dev": True,
            "hmg": False,
            "prd": True
        }

        if os.getenv("STAGE", None) is None:
            stage_config_aux = {
                "development": "dev",  # configmap-dev.env
                "production": "prd"  # docker-compose.yml
            }
            try:
                stageSetted = stage_config_aux[os.getenv("FLASK_ENV", "local")]
            except:
                stageSetted = 'local'
        else:
            stageSetted = 'local'

        dot_env_path = os.path.join(BASE_DIR, stage_config[stageSetted])

        OVERRIDE_SO_ENV = dotenv_config[stageSetted]
        load_dotenv(dotenv_path=dot_env_path, override=OVERRIDE_SO_ENV)

    @staticmethod
    def str_to_bool(s: str):
        if type(s) == str:
            b = s.lower()
            if b == 'true':
                return True
            elif b == 'false':
                return False
        elif type(s) == bool:
            return s

    @staticmethod
    def validate_fields_and_values(body, fields_to_validate, values_to_validation=None):
        """

        :param body: request no formato json
        :param fields_to_validate: atributos que devem estar no body
        :param values_to_validation: testa o valor de um determinado atributo
        :return: body validado
        """
        if str(body) in ["None", "", "b''"]:
            return {"message": "request body is empty."}

        fields_name = ""
        fields_validate_total = len(fields_to_validate)
        fields_validate_count = len(fields_to_validate)
        for field in fields_to_validate:
            if body.get(field) is None:
                fields_validate_count -= 1
                fields_name += field + ", "
        fields_name = fields_name[:-2]

        if not fields_validate_count == fields_validate_total:
            return {"message": f"[{fields_name}] is not in the request body."}

        if values_to_validation is not None:
            for value in values_to_validation.keys():
                if body[value] not in values_to_validation[value]:
                    return {"message": f"invalid value to '{value}': Valid values is {values_to_validation[value]}"}
        return body

    @staticmethod
    def calculate_exchange(from_, to, amount, tx):
        return float(tx)*float(amount)

    @staticmethod
    def get_current_timestamp(timestamp_format="iso"):
        current_datetime = datetime.now()
        result = current_datetime.strftime(timestamp_formats[timestamp_format])
        return result
