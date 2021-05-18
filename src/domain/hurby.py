import sys
from threading import Thread
import xml.etree.ElementTree as ET
from multiprocessing import set_start_method
from src.exception.hurby_exception_hook import HurbyExceptionHook
from src.service.logger_service import Logger
from src.service.api_system_service import ApiSystemService
from src.service.redis_cache_service import RedisCacheService
from src.support.functions import Functions


class Hurby:
    def __init__(self, config):
        # Environment variables
        self.config = config
        self.logger = Logger(config=self.config, name="synthetic", file_name="hurby.log").log

        self.api_conversion = ApiSystemService(
            config=config.WEB_API_CONFIG,
            system='hurby',
            time_out=config.HURBY_TIME_OUT
        )

        # Redis instance
        self.cache = RedisCacheService(
            host=config.REDIS_CACHE_HOST,
            port=config.REDIS_CACHE_PORT,
            db=config.REDIS_CACHE_DB,
            password=config.REDIS_CACHE_PASSWORD
        )

        # Instantiate an object of type HurbyExceptionHook
        self.hurby_exception_hook = HurbyExceptionHook(config=config)

        # Install thread except hook: Bug fix - https://bugs.python.org/issue1230540
        self.hurby_exception_hook.install_thread_except_hook()

        # Use custom error capture method
        sys.excepthook = self.hurby_exception_hook.custom_except_hook

        # Multiprocessing method choosen
        set_start_method("spawn", True)

    def run(self):
        def job():
            # Normalizes tags with system queries and WebIDs
            if self.cache.get("currencies") is None:
                self.create_currencies()

            # Records date and time of scheduler
            timestamp = Functions.get_current_timestamp()
            self.cache.set(key="scheduler_startup_time", value=timestamp, serialization=True)

        if self.config.STAGE in self.config.TASK_SCHEDULER_RUN_AUTHORIZATION:
            thread = Thread(target=job)
            thread.start()

    def create_currencies(self):
        self.logger.info("The search for available currencies has started")
        currencies = {}

        try:
            response = self.api_conversion.get_value_by_web_id(
                platform=self.config.HURBY_PLATFORM_DEFAULT,
                web_id=0,
                parameters='',
                system='hurby'
            )

            # Treatment of xml format
            root = ET.fromstring(response.content)
            for child in root.iter('*'):
                if child.tag != 'xml' and child.text is not None:
                    currencies.update({child.tag: [child.text, True]})  # True(true) or False(fictitious)

            # Writes standardized currencies to Redis
            self.cache.set(key="currencies", value=currencies, serialization=True)
        except Exception as e:
            self.hurby_exception_hook.logger.exception(e)
        finally:
            self.logger.info(f"The search for available currencies ended with {len(currencies)} insertions")
