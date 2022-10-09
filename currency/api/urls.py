from django.urls import path

from currency.api.views import FictionalCurrenciesView
from currency.api.views import FictionalCurrencyView


urlpatterns = [
    path('currencies/', FictionalCurrenciesView.as_view()),
    path('currency/', FictionalCurrencyView.as_view()),
    path('currency/<int:pk>/', FictionalCurrencyView.as_view()),
]
