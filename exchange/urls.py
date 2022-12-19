from django.urls import include, path
from rest_framework import routers
from exchange.core.views import CurrencyModelViewSet, ConvertCurrencyGenericViewSet


router = routers.DefaultRouter()
router.register(r'currencies', CurrencyModelViewSet)
router.register(r'convert', ConvertCurrencyGenericViewSet, basename='convert')

urlpatterns = [
    path('', include(router.urls)),
]
