from django.urls import include, path
from rest_framework import routers
from exchange.core.views import CurrencyModelViewSet, ConvertCurrencyAPIView


router = routers.DefaultRouter()
router.register(r'currencies', CurrencyModelViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('convert/', ConvertCurrencyAPIView.as_view(), name='convert'),
]
