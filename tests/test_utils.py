from unittest import TestCase
from unittest.mock import patch
from services.utils import is_currency_avaliable, is_currency_fictional, has_fictional_currency_flow, not_fictional_currency_flow

class TestTasks(TestCase):

    @patch("services.utils.Redis")
    def test_is_currency_fictional(self,mock_redis):
        mock_redis.return_value.get_currency.return_value = {'currency_name': 'TESTE', 'is_fictional': 'True', 'backing': 'NOT', 'backing_amount': '1.0'}
        response = is_currency_fictional("TESTE")
        self.assertEqual(response,True)

    @patch("services.utils.Redis")
    def test_is_currency_fictional_false(self,mock_redis):
        mock_redis.return_value.get_currency.return_value = {'currency_name': 'TESTE', 'is_fictional': 'false', 'backing': 'NOT', 'backing_amount': '1.0'}
        response = is_currency_fictional("TESTE")
        self.assertEqual(response,False)

    @patch("services.utils.Redis")
    def test_is_currency_avaliable(self,mock_redis):
        mock_redis.return_value.get_avaliable_currencies.return_value = ["TESTE"]
        response = is_currency_avaliable("TESTE")
        self.assertEqual(response,True)

    @patch("services.utils.Redis")
    def test_is_currency_avaliable_false(self,mock_redis):
        mock_redis.return_value.get_avaliable_currencies.return_value = ["TESTE222"]
        response = is_currency_avaliable("TESTE")
        self.assertEqual(response,False)

    @patch("services.utils.Redis")
    def test_is_currency_avaliable_false(self,mock_redis):
        mock_redis.return_value.get_avaliable_currencies.return_value = ["TESTE222"]
        response = is_currency_avaliable("TESTE")
        self.assertEqual(response,False)

    @patch("services.utils.AwesomeApiService")
    def test_not_fictional_flow(self,mock_api):
        expected_response = {
        "bid_value": 1,
        "converted_value": 1,
        }
        mock_api.return_value.get_bid_value_from_api.return_value = 1
        response = not_fictional_currency_flow("TESTE","TESTE",1)
        self.assertEqual(response,expected_response)

    @patch("services.utils.AwesomeApiService")
    def test_fictional_flow(self,mock_api):
        expected_response = {
        "bid_value": 1,
        "converted_value": 1,
        }
        mock_api.return_value.get_bid_value_from_api.return_value = 1
        response = has_fictional_currency_flow("TESTE","TESTE",1)
        self.assertEqual(response,expected_response)
