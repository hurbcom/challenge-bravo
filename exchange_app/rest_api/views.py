from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import CurrencySerializer
from rest_framework import status
from rest_framework import viewsets
from django.utils import timezone
from datetime import timedelta
from datetime import datetime
from .models import Currency
from decimal import Decimal
import requests
import json
import time

class CurrencyViewSet(viewsets.ModelViewSet):
    serializer_class = CurrencySerializer
    queryset = Currency.objects.all()

    def list(self, request):
        #CHECK IF THE USER HAS PASSED SOME PARAMS
        query_params_keys = list(request.query_params.keys())
        query_params_keys.sort()
        if query_params_keys == ['amount', 'from', 'to']:
            _amount = request.query_params.get('amount')
            _from = request.query_params.get('from').upper()
            _to = request.query_params.get('to').upper()

        # CHECK IF THE CURRENCIES EXISTS AND COLLECT THEIR BASE VALUES
            try:
                _fromSelect = Currency.objects.get(symbolAlias=str(_from)).symbolAlias
                _fromBaseValue = Currency.objects.get(symbolAlias=str(_from)).baseUsdValue
            except Exception as e:
                _fromSelect = ""
                _fromBaseValue = 0
                response = {'Result': 'Failed',
                           'Reason' : str(e),
                           }
            try:
                _toSelect = Currency.objects.get(symbolAlias=str(_to)).symbolAlias
                _toBaseValue = Currency.objects.get(symbolAlias=str(_to)).baseUsdValue
            except Exception as e:
                _toSelect = ""
                _toBaseValue = 0
                response = {'Result': 'Failed',
                           'Reason' : str(e),
                           }

        # CHECK IF HAS NO PARAMS AND THEN REDIRECT TO SELECT ALL
        if len(query_params_keys) == 0:
            queryset = Currency.objects.all()
            serializer = CurrencySerializer(queryset, many=True)
            return Response(serializer.data)

        # CHECK IF PARAMS OK AND THEN COVERT, OTHERWISE RETRIEVE THE ERROR
        elif query_params_keys == ['amount', 'from', 'to']:
            if str(_from) == str(_fromSelect) and str(_to) == str(_toSelect):
                multiplier = Decimal(_amount) / Decimal(_fromBaseValue)
                result = Decimal(multiplier * (Decimal(_toBaseValue)))
                response = {'From': _fromSelect,
                           'To': _toSelect,
                           'Amount': str(_amount),
                           'FinalValue': "{:.2f}".format(result)
                           }
                return Response(status=status.HTTP_200_OK, data=json.dumps(response))
            else:
                response = {'Result': 'Failed',
                           'Reason': 'Verify if Currency is registered, or your request sintaxe',
                           }
                return Response(status=status.HTTP_400_BAD_REQUEST, data=json.dumps(response))
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=json.dumps(response))

    def create(self, request, *args, **kwargs):
        url = 'https://v6.exchangerate-api.com/v6/4305ebd414a30fbf5d7d8171/latest/USD'
        result = requests.get(url, headers={'X-CoinAPI-Key': '4305ebd414a30fbf5d7d8171'})
        if result.status_code == 200:
            dict_result = json.loads(result.content)
            result = dict_result['conversion_rates']
            lastTimeUpd = datetime.fromtimestamp(int(dict_result['time_last_update_unix']))
            lastTimeUpd = lastTimeUpd + timedelta(days=1)
            for x, y in result.items():
                try:
                    _Currency = Currency.objects.get(symbolAlias=x)
                    _Currency.baseUsdValue = Decimal(y)
                    _Currency.quotationDate = lastTimeUpd
                    _Currency.lastUpdateDate = timezone.now()
                    _Currency.save()
                except Exception as e:
                    pass
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        if instance.symbolAlias == 'USD':
            response = {'Result': 'Failed',
                        'Reason': 'Invalid Operation, Currency USD cannot be Updated.',
                        }
            return Response(status=status.HTTP_400_BAD_REQUEST, data=json.dumps(response))
        url = 'https://v6.exchangerate-api.com/v6/4305ebd414a30fbf5d7d8171/latest/USD'
        result = requests.get(url, headers={'X-CoinAPI-Key': '4305ebd414a30fbf5d7d8171'})
        if result.status_code == 200:
            dict_result = json.loads(result.content)
            result = dict_result['conversion_rates']
            lastTimeUpd = datetime.fromtimestamp(int(dict_result['time_last_update_unix']))
            lastTimeUpd = lastTimeUpd + timedelta(days=1)
            lastTimeUpd2 = datetime.strftime(timezone.now(), "%Y-%m-%d %H:%M:%S")
            for x, y in result.items():
                try:
                    #print(str(x)+"-"+str(y))
                    _Currency = Currency.objects.get(symbolAlias=x)
                    _Currency.baseUsdValue = Decimal(y)
                    _Currency.save()
                except Exception as e:
                    pass
            #ATUALIZAR HORÁRIOS EM TODOS OS ATIVOS
            try:
                _Currency_A = Currency.objects.all().update(lastUpdateDate=lastTimeUpd2)
                _Currency_A = Currency.objects.all().update(quotationDate=lastTimeUpd)
                _Currency_A.save()
            except Exception as e:
                pass
        response = {'Result': 'Success',
                    'Reason': 'Currency Updated',
                    }
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.symbolAlias == 'USD':
            response = {'Result': 'Failed',
                        'Reason': 'Invalid Operation, Currency USD cannot be deleted.',
                        }
            return Response(status=status.HTTP_400_BAD_REQUEST, data=json.dumps(response))
        self.perform_destroy(instance)
        return Response(status=status.HTTP_200_OK)

#METHOD TO UPDATE THE DATABASE QUOTES
class QuoteUpdate(viewsets.ModelViewSet):
    serializer_class = CurrencySerializer
    queryset = Currency.objects.all()

    def list(self, request):
        quoteDate = Currency.objects.get(symbolAlias='USD').quotationDate
        lastUpd = Currency.objects.get(symbolAlias='USD').lastUpdateDate
        dateDiff = (timezone.now() - lastUpd) #OBS IF WANT TO UPDATE BY LAST UPDATE OR LAST QUOTE DATE
        dateDiff_Obj = time.gmtime(dateDiff.total_seconds())

        if int(time.strftime('%H', dateDiff_Obj)) >= 1: #OBS TO FREQUENCY OF UPDATE (1) = EACH 1 HOUR
            url = 'https://v6.exchangerate-api.com/v6/4305ebd414a30fbf5d7d8171/latest/USD'
            result = requests.get(url, headers={'X-CoinAPI-Key': '4305ebd414a30fbf5d7d8171'})
            if result.status_code == 200:
                dict_result = json.loads(result.content)
                result = dict_result['conversion_rates']
                lastTimeUpd = datetime.fromtimestamp(int(dict_result['time_last_update_unix']))
                lastTimeUpd = lastTimeUpd + timedelta(days=1)
                for x, y in result.items():
                    try:
                        _Currency = Currency.objects.get(symbolAlias=x)
                        _Currency.baseUsdValue = Decimal(y)
                        _Currency.quotationDate = lastTimeUpd
                        _Currency.lastUpdateDate = timezone.now()
                        _Currency.save()
                    except Exception as e:
                        pass

                response = {
                    'Result': 'Success',
                    'QuotationDate': str(quoteDate.strftime(" %d-%m-%y %H:%M:%S")),
                    'CurrentDate': str(timezone.now().strftime("%d-%m-%y %H:%M:%S")),
                    'StatusBase': 'Now Up To Date'
                }
                return Response(status=status.HTTP_200_OK, data=json.dumps(response))
            else:
                response = {
                    'Result': 'Failed',
                    'Reason': str(result.content),
                }
                return Response(status=status.HTTP_400_BAD_REQUEST, data=json.dumps(response))

        else:
            response = {
                'Resultado' : 'Sucesso',
                'QuotationDate' : str(quoteDate.strftime(" %d-%m-%y %H:%M:%S")),
                'CurrentDate' : str(timezone.now().strftime("%d-%m-%y %H:%M:%S")),
                'StatusBase': 'Already Up To Date'
            }
            return Response(status=status.HTTP_200_OK, data=json.dumps(response))

        response = {
            'Result': 'Success',
            'QuotationDate': str(quoteDate.strftime(" %d-%m-%y %H:%M:%S")),
            'CurrentDate': str(timezone.now().strftime("%d-%m-%y %H:%M:%S")),
            'StatusBase': '---'
        }
        return Response(status=status.HTTP_200_OK, data=json.dumps(response))