from rest_framework import viewsets, status
from django_filters import rest_framework as filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from django.conf import settings

from .models import MyCoin
from .serializers import MyCoinSerializer, ConvertSerializer
from backend.services import Convert
from .filterset import MyCoinFilter


class MyCoinViewSet(viewsets.ModelViewSet):
    queryset = MyCoin.objects.all()
    serializer_class = MyCoinSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = MyCoinFilter

    @action(detail=False, methods=['get'], serializer_class=ConvertSerializer)
    def convert(self, request):
        from_coin = request.query_params.get('from')
        to_coin = request.query_params.get('to')
        amount = float(request.query_params.get('amount', '1'))

        convert = Convert(from_coin=from_coin, to_coin=to_coin, amount=amount)
        # Returns the already converted value
        value_convert = convert.set_convert()

        if value_convert > 0:
            convert_obj = Convert(
                from_coin=from_coin, to_coin=to_coin, amount=value_convert
            )
            serializer = self.get_serializer(convert_obj)
            return Response(serializer.data)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    @method_decorator(vary_on_cookie)
    @method_decorator(cache_page(settings.CACHE_TTL))
    def dispatch(self, *args, **kwargs):
        return super(MyCoinViewSet, self).dispatch(*args, **kwargs)
