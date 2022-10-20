from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status


class AuthenticationUserTestCase(APITestCase):
    def setUp(self):
        self.list_url = reverse("coins-list")
        self.user = User.objects.create_user("admin", password="admin")

    def test_request_is_unauthorized(self):
        """Test to verify the request is unauthorized"""
        response = self.client.get(self.list_url)
        self.assertEquals(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authentication_user_with_correctly_credentials(self):
        """Test that checks authentication of an user with correctly credentials"""
        user = authenticate(username="admin", password="admin")
        self.assertTrue((user is not None) and user.is_authenticated)

    def test_authentication_user_with_incorrectly_username(self):
        """Test that checks authentication of an user with incorrectly username credential"""
        user = authenticate(username="adm1n", password="admin")
        self.assertFalse((user is not None) and user.is_authenticated)

    def test_authentication_user_with_incorrectly_password(self):
        """Test that checks authentication of an user with incorrectly password credential"""
        user = authenticate(username="admin", password="adm!n")
        self.assertFalse((user is not None) and user.is_authenticated)
