from django.urls import include, path
from rest_framework import routers
from exchange.core.views import CurrencyModelViewSet


router = routers.DefaultRouter()
router.register(r'currencies', CurrencyModelViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
