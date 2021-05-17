from src.domain.hurby import Hurby
from src.support.configs import Configs
from src.web_api.urls import Urls


class Main:
    def __init__(self):
        # Convert environment variables to structure
        self.config = Configs()

        # HUBY instance
        self.hurby = Hurby(config=self.config)

        # Routes instance
        self.urls = Urls(application=self.hurby)

    def run(self):
        # Run web api
        self.urls.run()


if __name__ == "__main__":
    MAIN = Main()
    MAIN.run()
