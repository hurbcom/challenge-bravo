import os
from src.support.functions import Functions


class Configs:

    def __init__(self, load_envs_from_file=True):
        if load_envs_from_file:
            # Load environment variables from configmap-<stage>.env
            Functions.load_all_environment_variables()

        # System
        self.DEBUG_MODE = Functions.str_to_bool(os.getenv("DEBUG_MODE"))
        self.STAGE = os.getenv("STAGE")

        # FLASK
        self.FLASK_PORT = int(os.getenv("PORT"))
        self.FLASK_HOST = os.getenv("HOST")
