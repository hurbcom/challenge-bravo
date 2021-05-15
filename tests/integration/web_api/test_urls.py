from flask_restful import Resource
from tests.integration.web_api.test_case_base import TestCaseBase

mock_data = {"message": "Tests working"}


class Test(Resource):
    @staticmethod
    def get():
        return mock_data


class TestCaseUrls(TestCaseBase):
    def test_add_routes(self):
        self.web_api.add_resource(Test, "/test")
        resp = self.client.get("/test")
        self.custom_assert(response=resp, status_code=200, data_comper=mock_data)
