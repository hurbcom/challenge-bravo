import requests
from django.conf import settings
from rest_framework import views
from rest_framework.response import Response

from exchange.core.models import Currency


class CoinbaseAPIView(views.APIView):
    def coinbase_updater(self):
        """Updates the currency rate dynamiclly that exists on database.

        : return Response
        """
        if data := self._get_coinbase():
            try:
                currencies = Currency.objects.coinbase()
                for currency in currencies:
                    currency.rate = data['rates'][currency.code]

                Currency.objects.bulk_update(currencies, ['rate'])
                return Response(data)

            except:
                pass

    def _get_coinbase(self):
        """Makes GET request on API_COINBASE_BACKED_TO_USD.

        : return requests.Response.json or None
        """
        response = requests.get(settings.API_COINBASE_BACKED_TO_USD)

        try:
            response.raise_for_status()
            return response.json().get('data')

        except:
            return None
