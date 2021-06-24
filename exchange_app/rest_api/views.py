from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from decimal import Decimal
from datetime import datetime
from .models import Currency
from .serializers import CurrencySerializer
import json

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

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.symbolAlias == 'USD':
            response = {'Result': 'Failed',
                        'Reason': 'Invalid Operation, Currency USD cannot be deleted.',
                        }
            return Response(status=status.HTTP_400_BAD_REQUEST, data=json.dumps(response))
        self.perform_destroy(instance)
        return Response(status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.symbolAlias == 'USD':
            response = {'Result': 'Failed',
                        'Reason': 'Invalid Operation, Currency USD cannot be Updated.',
                        }
            return Response(status=status.HTTP_400_BAD_REQUEST, data=json.dumps(response))
        self.perform_update(instance)
        return Response(status=status.HTTP_200_OK)