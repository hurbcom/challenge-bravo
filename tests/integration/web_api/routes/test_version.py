from tests.integration.web_api.test_case_base import TestCaseBase
from src.support.functions import Functions


class TestCaseVersion(TestCaseBase):
    def test_get(self):
        data = {
            "HUBy": 1
        }
        resp = self.client.get("/huby/version")
        self.custom_assert(response=resp, status_code=200, data_comper=data)
