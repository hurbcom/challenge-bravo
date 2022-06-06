import requests
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class ConvertApiView(APIView):
    def get(self, request, of, to, amount):
        response = requests.get(f'https://economia.awesomeapi.com.br/last/{of}-{to}')
        data = response.json()
        convert_currency = float(data[next(iter(data))]["bid"]) * amount

        return Response(
            data=round(convert_currency, 2),
            status=status.HTTP_200_OK
        )
