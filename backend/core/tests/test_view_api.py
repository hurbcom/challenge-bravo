from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth.models import Group, User

from backend.core.models import MyCoin


def setClient():
    url_get_token = reverse('token_obtain_pair')
    username = 'admin'
    email = 'admin@example.com'
    password = '12345678'

    grpadmin, _ = Group.objects.get_or_create(name='admin')
    user = User.objects.create(
        username=username, email=email
    )
    user.groups.add(grpadmin.id)
    user.set_password(password)
    user.save()

    client = APIClient()
    resp = client.post(
        url_get_token,
        {'username': username, 'password': password},
        format='json'
    )
    token = resp.data['access']
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

    return client


class ApiTest(TestCase):
    def setUp(self):
        self.client = setClient()
        self.path = '/api/v1/core'
        self.mycoin_from = MyCoin.objects.create(
            codecoin='GTA$',
            namecoin='GTA Coin',
            price=7
        )
        self.mycoin_to = MyCoin.objects.create(
            codecoin='GEAR',
            namecoin='Metal Gear Coin',
            price=12
        )

    def test_post_mycoin(self):
        response = self.client.post(
            self.path + '/converter/',
            data={
                "codecoin": "HURB",
                "namecoin": "Hurb Coin",
                "price": 5
            }
        )
        self.assertEqual(response.status_code, 201)

    def test_get_mycoin(self):
        response = self.client.get(self.path + '/converter/')
        self.assertEqual(response.status_code, 200)

    def test_put_mycoin(self):
        response = self.client.put(
            self.path + '/converter/' + str(self.mycoin_from.id) + '/',
            data={
                "codecoin": "NIRV",
                "namecoin": "Nirvana Coin",
                "price": 10
            }
        )
        self.assertEqual(response.status_code, 200)

    def test_delete_mycoin(self):
        response = self.client.delete(
            self.path + '/converter/' + str(self.mycoin_from.id) + '/'
        )
        self.assertEqual(response.status_code, 204)

    def test_convert_coin(self):
        querystring = '?from_coin={}&to={}&amount=1'.format(
            self.mycoin_from.codecoin, self.mycoin_to.codecoin
        )
        response = self.client.get(
            self.path + '/converter/convert/' + querystring
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            (1 * (self.mycoin_from.price / self.mycoin_to.price)),
            response.data['_amount']
        )
