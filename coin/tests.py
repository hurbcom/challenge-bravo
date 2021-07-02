from rest_framework import status
from rest_framework.test import APITestCase, URLPatternsTestCase
from rest_framework.test import APIRequestFactory
from coin.api.CoinViewSet import CointViewSet
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from coin.model.CoinModel import CoinModel


class CointTests(APITestCase, URLPatternsTestCase):
    router = DefaultRouter()

    urlpatterns = [
        path('api/v1/', include(router.urls))
    ]

    coins = [
        {
            "coin": "DOLLAR",
            "coin_initials": "USD",
            "amount_coint_bslt": 1,
            "price": 1,
            "country": "United State of America",
            "country_initials": "USA",
            "bslt": "USD"
        },

        {
            "coin": "REAL",
            "coin_initials": "BRL",
            "amount_coint_bslt": 1,
            "price": 0.2029,
            "country": "BRAZIL",
            "country_initials": "BR",
            "bslt": "USD"
        },

        {
            "coin": "EURO",
            "coin_initials": "EUR",
            "price": 1.1925,
            "amount_coint_bslt": 1,
            "country": "EUROPEN UNION",
            "country_initials": "EU",
            "bslt": "USD"
        },

        {
            "coin": "BITCOIN",
            "coin_initials": "BTC",
            "price": 34713.90,
            "amount_coint_bslt": 1,
            "country": "GLOBAL",
            "country_initials": "GB",
            "bslt": "USD"
        },

        {
            "coin": "ETHERIUN",
            "coin_initials": "ETH",
            "price": 1991.50,
            "amount_coint_bslt": 1,
            "country": "GLOBAL",
            "country_initials": "GB",
            "bslt": "USD"
        },

        {
            "id": 6,
            "price": 0.1433,
            "coin": "BOLIVIANO",
            "coin_initials": "BOB",
            "amount_coint_bslt": 1,
            "country": "BOLIVIA",
            "country_initials": "BL",
            "bslt": "USD"
        }
    ]
    def setUp(self) -> None:
        self._factory = APIRequestFactory(enforce_csrf_checks=False)
        self._data = self.coins

    def test_create_coin(self):
        view = CointViewSet.as_view({'post': 'create'})
        request = self._factory.post('coin/create/', self._data)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def teste_update_coin(self):
        self.test_create_coin()
        coin = CoinModel.objects.all()
        factory = APIRequestFactory()
        view = CointViewSet.as_view({'put': 'update_all_coin'})
        request = factory.put('coin/update_coin/', self._data)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list(self):
        view = CointViewSet.as_view({'get': 'list'})
        request = self._factory.get('coin/list/?page=1&size=20')
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete(self):
        self.test_create_coin()
        coin = CoinModel.objects.all()
        view = CointViewSet.as_view({'delete': 'delete'})
        request = self._factory.delete('coin/delete/', self._data)
        response = view(request, coin.first().id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)