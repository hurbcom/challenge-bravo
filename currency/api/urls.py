from django.urls import path

from currency.api.views import ConvertCurrencyViewSet
from currency.api.views import FictionalCurrenciesView
from currency.api.views import FictionalCurrencyView
from currency.api.views import OfficialCurrenciesView


urlpatterns = [
    path('convert/', ConvertCurrencyViewSet.as_view()),
    path('official-currencies/', OfficialCurrenciesView.as_view()),
    path('fictional-currencies/', FictionalCurrenciesView.as_view()),
    path('fictional-currency/', FictionalCurrencyView.as_view()),
    path('fictional-currency/<str:currency_short_name>/', FictionalCurrencyView.as_view()),
]
