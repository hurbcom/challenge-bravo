from decimal import Decimal

import requests
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from xmltodict import parse as xml_to_dict

from hurb.currency.models import Currency


class ConvertApiView(APIView):
    def get(self, request, of, to, amount):
        list_currencies = xml_to_dict(requests.get('https://economia.awesomeapi.com.br/xml/available/uniq').content)
        list_currencies = list_currencies[next(iter(list_currencies))]

        if of in list_currencies.keys() and to in list_currencies.keys():
            response = requests.get(f'https://economia.awesomeapi.com.br/last/{of}-{to}')
            data = response.json()

            convert_currency = float(data[next(iter(data))]["bid"]) * amount

        elif of not in list_currencies.keys() and to not in list_currencies.keys():
            of = Currency.objects.get(name=of)
            to = Currency.objects.get(name=to)

            convert_currency = Decimal(of.value) * Decimal(to.value) * Decimal(amount).quantize(Decimal('.1'))

        elif of in list_currencies.keys() and to not in list_currencies.keys():
            to_value = Currency.objects.get(name=to).value
            if of == 'BRL':
                convert_currency = Decimal(amount) * to_value
            else:
                response = requests.get('https://economia.awesomeapi.com.br/last/BRL-USD')
                data = response.json()
                base = Decimal(data[next(iter(data))]["bid"])

                convert_currency = base * Decimal(amount) * to_value

        elif to in list_currencies.keys() and of not in list_currencies.keys():
            of_value = Currency.objects.get(name=of).value
            if of == 'BRL':
                convert_currency = Decimal(amount) / of_value
            else:
                response = requests.get('https://economia.awesomeapi.com.br/last/BRL-USD')
                data = response.json()
                base = Decimal(data[next(iter(data))]["bid"])

                convert_currency = base * Decimal(amount) * of_value

        return Response(
            data=round(convert_currency, 2),
            status=status.HTTP_200_OK
        )
