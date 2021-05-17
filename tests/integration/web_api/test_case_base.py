from unittest import TestCase
from src.domain.hurby import Hurby
from src.support.configs import Configs
from src.web_api.urls import Urls


class TestCaseBase(TestCase):
    def setUp(self) -> None:
        self.config = Configs()
        self.huby = Hurby(config=self.config)
        self.urls = Urls(self.huby)
        self.server = self.urls.server
        self.web_api = self.urls.web_api
        self.client = self.server.test_client()

    def custom_assert(self, response, status_code, data_comper):
        self.assertEqual(response.status_code, status_code)
        self.assertEqual(response.json, data_comper)
