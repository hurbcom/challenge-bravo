from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'currency', views.CurrencyViewSet)
router.register(r'currency_exchange', views.CurrencyExchangeViewSet)
router.register(r'calculate', views.CalculateCurrencyAmountView, 'currency')

calculation_routes = (
    r'calculate/',
    r'calculate/from/<str:from>/to/<str:to>/amount/<str:amount>',
    r'calculate/(?from=<from>[A-Z]w+)/$&(?to=<to>[A-Z]w+)/$&(?amount=<amount>\d+\.\d{1,2})/$'
)

urlpatterns = [
    path('', include(router.urls)),
    # path('', include(api_router.urls)),
    # calculate/
    path(calculation_routes[0], views.CalculateCurrencyAmountView.as_view({'get': 'get'})),
    # calculate/from/USD/to/BRL/amount/15.5
    path(calculation_routes[1], views.CalculateCurrencyAmountView.as_view({'get': 'get'})),
    # ?from=USD&to=BRL&amount=15.5
    path(calculation_routes[2], views.CalculateCurrencyAmountView.as_view({'get': 'get'})),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
