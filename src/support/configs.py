import os
import json
from src.support.functions import Functions


class Configs:

    def __init__(self, load_envs_from_file=True):
        if load_envs_from_file:
            # Load environment variables from configmap-<stage>.env
            Functions.load_all_environment_variables()

        # System
        self.DEBUG_MODE = Functions.str_to_bool(os.getenv("DEBUG_MODE"))
        self.STAGE = os.getenv("STAGE", 'local')

        # HURy
        self.HURBY_PLATFORM_DEFAULT = os.getenv("HURBY_PLATFORM_DEFAULT", 'P-01')
        self.HURBY_PLATFORMS = list(os.getenv("HURBY_PLATFORMS").split(","))
        self.HURBY_DATA_FOLDER = os.getenv("HURBY_DATA_FOLDER")
        self.HURBY_TIME_OUT = int(os.getenv("HURBY_TIME_OUT"))

        # API System: Web Api for currency conversion
        self.WEB_API_CONFIG = {}
        for platform in self.HURBY_PLATFORMS:
            self.WEB_API_CONFIG.update({
                platform:
                    self.__open_json(self.__chosen_stage(self.__chosen_platform(platform, os.getenv("API_CONVERSION"))))
            })

        # FLASK
        self.FLASK_PORT = int(os.getenv("PORT"))
        self.FLASK_HOST = os.getenv("HOST")

    def __open_json(self, filename):
        self.FILE_NAME = os.path.join(self.HURBY_DATA_FOLDER, filename)
        if os.path.exists(self.FILE_NAME):
            with open(self.FILE_NAME, 'r', encoding='utf-8') as file:
                data = json.load(file)
            return data
        else:
            raise ValueError(f"No such file or directory: 'path of file to {filename} not have specified'")

    @staticmethod
    def __chosen_platform(platform, filename):
        return str(filename).replace("{PLATFORM}", platform)

    def __chosen_stage(self, filename):
        return str(filename).replace("{STAGE}", self.STAGE)
