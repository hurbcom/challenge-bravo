from rest_framework import status


class TestCurrency:
    def test_create_farm(self, api_client, user):
        api_client.force_authenticate(user)
        response = api_client.get('/v1/convert/from=USD&to=BRL&amount=5/')
        assert response.status_code == status.HTTP_200_OK
