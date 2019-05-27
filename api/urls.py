from django.urls import path, include
from rest_framework import routers

from api.views import CurrencyViewSet

app_name = 'api'

router = routers.DefaultRouter()
router.register('currencies', CurrencyViewSet, base_name='currency')

urlpatterns = [
    path('', include(router.urls)),
]