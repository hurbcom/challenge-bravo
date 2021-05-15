import os
from dotenv import load_dotenv


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

        stageSetted = os.getenv("STAGE", 'local')

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
