from django.urls import path, include
from rest_framework import routers
from .views import ExchangeCoinView, CoinViewSet

router = routers.DefaultRouter()
router.register(r"coins", CoinViewSet, basename="coins")

urlpatterns = [
    path("", include(router.urls)),
    path("exchange-coin", ExchangeCoinView.as_view()),
]
