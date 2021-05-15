from tests.integration.web_api.test_case_base import TestCaseBase


class TestCaseRoot(TestCaseBase):
    def test_get(self):
        data = {"message": "working"}
        resp = self.client.get("/")
        self.custom_assert(response=resp, status_code=200, data_comper=data)
