from django.urls import path

from currency.api.views import ConvertCurrencyViewSet
from currency.api.views import FictionalCurrenciesView
from currency.api.views import FictionalCurrencyView


urlpatterns = [
    path(
        'convert/<str:amount>/<str:currency_from>/<str:currency_to>/',
        ConvertCurrencyViewSet.as_view()
    ),
    path('currencies/', FictionalCurrenciesView.as_view()),
    path('currency/', FictionalCurrencyView.as_view()),
    path('currency/<str:currency_short_name>/', FictionalCurrencyView.as_view()),
]
