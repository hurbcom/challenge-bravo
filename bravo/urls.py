from django.urls import path
from .api.views import ConverterView, GerenciarMoedasView

urlpatterns = [
    path('converter/', ConverterView.as_view(), name='converter'),
    path('gerenciar-moedas/', GerenciarMoedasView.as_view(), name='gerenciar-moedas'),
]
