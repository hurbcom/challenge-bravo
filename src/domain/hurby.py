from src.service.api_system_service import ApiSystemService


class Huby:
    def __init__(self, config):
        # Environment variables
        self.config = config

        self.api_conversion = ApiSystemService(
            config=config.WEB_API_CONFIG,
            system='huby',
            time_out=config.HUBY_TIME_OUT
        )
