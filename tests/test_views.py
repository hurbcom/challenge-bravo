from unittest import TestCase
from unittest.mock import patch
from inputs import Currency
from views import create_currency, convert

class TestTasks(TestCase):

    @patch("views.Redis")
    def test_create_currency(self,mock_redis):
        currency = Currency(currency_name="TESTE",is_fictional="True", backing="NOT", backing_amount="1.0")
        mock_redis.return_value.add_currency.return_value = {'currency_name': 'TESTE', 'is_fictional': 'True', 'backing': 'NOT', 'backing_amount': '1.0'}
        response = create_currency(currency)
        self.assertEqual(response[0],{'currency_name': 'TESTE', 'is_fictional': 'True', 'backing': 'NOT', 'backing_amount': '1.0'})

    @patch("views.is_currency_avaliable")
    @patch("views.is_currency_fictional")
    @patch("views.has_fictional_currency_flow")
    def test_convert(self,mock_has_fictional_currency_flow,mock_is_currency_fictional, mock_is_currency_avaliable):
        mock_has_fictional_currency_flow.return_value = {
        "bid_value": 1,
        "converted_value": 1,
        }
        mock_is_currency_fictional.return_value = True
        mock_is_currency_avaliable.return_value = True
        response = convert(from_currency="TESTE", to_currency="TESTE", amount=1)
        expected_response = {
        "bid_value": 1,
        "converted_value": 1,
        }
        self.assertEqual(response[0],expected_response)

    @patch("views.Redis")
    def test_edit_currency(self,mock_redis):
        currency = Currency(currency_name="TESTE",is_fictional="True", backing="NOT", backing_amount="1.0")
        mock_redis.return_value.add_currency.return_value = {'currency_name': 'TESTE', 'is_fictional': 'True', 'backing': 'NOT', 'backing_amount': '1.0'}
        response = create_currency(currency)
        self.assertEqual(response[0],{'currency_name': 'TESTE', 'is_fictional': 'True', 'backing': 'NOT', 'backing_amount': '1.0'})
