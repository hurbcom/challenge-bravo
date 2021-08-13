from rest_framework import viewsets
from django_filters import rest_framework as filters

from .models import MyCoin
from .serializers import MyCoinSerializer


class MyCoinViewSet(viewsets.ModelViewSet):
    queryset = MyCoin.objects.all()
    serializer_class = MyCoinSerializer
    filter_backends = (filters.DjangoFilterBackend,)
