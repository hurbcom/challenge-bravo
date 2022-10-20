from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from rest_framework import status
from exchange.models import Coin
from django.urls import reverse
from django.contrib.auth.models import User


class CoinTestCase(APITestCase):
    def setUp(self):
        self.list_url = reverse("coins-list")
        self.coin_1 = Coin.objects.create(name="EUR")
        self.coin_2 = Coin.objects.create(name="BTC")
        self.user = User.objects.create(username="admin", password="admin")
        self.token = Token.objects.create(user=self.user)
        self.client.login(username="admin", password="admin")
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

    def test_request_is_unauthorized(self):
        """Test to verify the request is unauthorized"""
        self.client.credentials()
        response = self.client.get(self.list_url)
        self.assertEquals(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_request_get_to_list_coins(self):
        """Test to verify the request get to list coins"""
        response = self.client.get(self.list_url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)

    def test_request_post_to_create_coin(self):
        """Test to verify the request post do create coin"""
        data = {"name": "ETH"}
        response = self.client.post(self.list_url, data=data)
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)

    def test_request_delete_to_delete_coin(self):
        """Test to verify the request delete do delete coin"""
        response = self.client.delete("/coins/1")
        self.assertEquals(response.status_code, status.HTTP_302_FOUND)

    def test_request_put_to_update_coin(self):
        """Test to verify the request put to update coin"""
        data = {"name": "BRL"}
        response = self.client.put("/coins/1", data=data)
        self.assertEquals(response.status_code, status.HTTP_302_FOUND)
