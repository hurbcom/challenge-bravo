from src.service.api_system_service import ApiSystemService


class Hurby:
    def __init__(self, config):
        # Environment variables
        self.config = config

        self.api_conversion = ApiSystemService(
            config=config.WEB_API_CONFIG,
            system='hurby',
            time_out=config.HURBY_TIME_OUT
        )
