from src.domain.hurby import Hurby
from src.support.configs import Configs
from src.support.functions import Functions
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
        # Clear all keys from redis
        self.hurby.cache.flush()

        # Records the system boot time
        system_boot_time = Functions.get_current_timestamp()
        self.hurby.cache.set(key="system_boot_time", value=system_boot_time, serialization=True)

        # Run task scheduler
        self.hurby.run()

        # Run web api
        self.urls.run()


if __name__ == "__main__":
    MAIN = Main()
    MAIN.run()
