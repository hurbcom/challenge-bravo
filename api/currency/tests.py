from django.test import TestCase
from rest_framework.test import APIRequestFactory
from .models import Currency, CurrencyExchange
from .views import CalculateCurrencyAmountView


class CurrencyTestCase(TestCase):
    def testCurrency(self):
        currency = Currency(iso_code="BTC", name="Bitcoin", territory="Virtual")
        self.assertEqual(currency.iso_code, "BTC")
        self.assertEqual(currency.name, "Bitcoin")
        self.assertEqual(currency.territory, "Virtual")


class CurrencyExchangeTestCase(TestCase):
    def testCurrencyExchange(self):
        currency_01 = Currency(iso_code="BTC", name="Bitcoin", territory="Virtual")
        currency_02 = Currency(iso_code="USD", name="Dólar Americano", territory="EUA")

        currency_exchange = CurrencyExchange(
            iso_code_from=currency_01,
            iso_code_to=currency_02,
            exchange_rate=40895.80
        )
        self.assertEqual(currency_exchange.iso_code_from.iso_code, "BTC")
        self.assertEqual(currency_exchange.iso_code_to.iso_code, "USD")
        self.assertEqual(currency_exchange.exchange_rate, 40895.80)


class CalculateCurrencyAmountViewTestCase(TestCase):
    def testCalculateCurrencyAmountView(self):
        factory = APIRequestFactory()
        request = factory.get('/calculate/')
        view = CalculateCurrencyAmountView.as_view({'get': 'get'})
        response = view(request)

        self.assertEqual(
            response.data,
            {'from': 'Campo obrigatório', 'to': 'Campo obrigatório', 'amount': 'Campo obrigatório'}
        )
