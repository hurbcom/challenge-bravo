from rest_framework import status
from rest_framework.test import APITestCase, URLPatternsTestCase
from rest_framework.test import APIRequestFactory
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from coin.api.CoinViewSet import CointViewSet
from convert.api.ConvertViewSet import ConvertViewSet

class ConvertTests(APITestCase, URLPatternsTestCase):
    router = DefaultRouter()

    urlpatterns = [
        path('api/v1/', include(router.urls))
    ]

    coins = [
        {
            "coin": "DOLLAR",
            "coin_initials": "USD",
            "price": 1,
            "country": "United State of America",
            "country_initials": "USA",
            "bslt": "USD"
        },

        {
            "coin": "REAL",
            "coin_initials": "BRL",
            "price": 0.2029,
            "country": "BRAZIL",
            "country_initials": "BR",
            "bslt": "USD"
        },

        {
            "coin": "EURO",
            "coin_initials": "EUR",
            "price": 1.1925,
            "country": "EUROPEN UNION",
            "country_initials": "EU",
            "bslt": "USD"
        },

        {
            "coin": "BITCOIN",
            "coin_initials": "BTC",
            "price": 34713.90,
            "country": "GLOBAL",
            "country_initials": "GB",
            "bslt": "USD"
        },

        {
            "coin": "ETHERIUN",
            "coin_initials": "ETH",
            "price": 1991.50,
            "country": "GLOBAL",
            "country_initials": "GB",
            "bslt": "USD"
        },

        {
            "id": 6,
            "price": 0.1433,
            "coin": "BOLIVIANO",
            "coin_initials": "BOB",
            "country": "BOLIVIA",
            "country_initials": "BL",
            "bslt": "USD"
        }
    ]

    def setUp(self) -> None:
        self._factory = APIRequestFactory(enforce_csrf_checks=False)
        self._from = 'BRL'
        self._to = 'EUR'
        self._amout = 1

    def test_create_coin(self):
        view = CointViewSet.as_view({'post': 'create'})
        request = self._factory.post('coin/create/', self.coins)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_convert(self):
        self.test_create_coin()
        view = ConvertViewSet.as_view({'get': 'convert'})
        request = self._factory.get(f'convert/?from={self._from}&to={self._to}&amount={self._amout}')
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)