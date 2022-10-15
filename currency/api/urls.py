from django.urls import path

from currency.api.views import ConvertCurrencyViewSet
from currency.api.views import FictionalCurrenciesView
from currency.api.views import FictionalCurrencyView


urlpatterns = [
    path('convert/', ConvertCurrencyViewSet.as_view(), name='api-convert-currency',),
    path('currencies/', FictionalCurrenciesView.as_view()),
    path('currency/', FictionalCurrencyView.as_view()),
    path('currency/<str:currency_short_name>/', FictionalCurrencyView.as_view()),
]
