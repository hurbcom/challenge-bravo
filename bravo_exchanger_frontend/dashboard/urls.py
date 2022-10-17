from django.urls import path

from dashboard.views import ConvertCurrency
from dashboard.views import FictionalCurrencies
from dashboard.views import FictionalCurrencyAdd
from dashboard.views import FictionalCurrencyEdit
from dashboard.views import FictionalCurrencyRemove


app_name = 'dashboard'


urlpatterns = [
    path('', FictionalCurrencies.as_view(), name='currencies'),
    path('moeda/adicionar/', FictionalCurrencyAdd.as_view(), name='add-fictional-currency'),
    path('moeda/converter/', ConvertCurrency.as_view(), name='convert-currency'),
    path(
        'moeda/editar/<str:currency_short_name>',
        FictionalCurrencyEdit.as_view(),
        name='edit-fictional-currency'
    ),
    path('moeda/remover/', FictionalCurrencyRemove.as_view(), name='remove-fictional-currency'),
]
