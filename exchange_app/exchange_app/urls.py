from django.urls import path, include
from rest_framework import routers
from rest_api import views

route = routers.DefaultRouter()
route.register(r'Currency', views.CurrencyViewSet, basename='Currency')
route.register(r'QuoteUpd', views.QuoteUpdate, basename='QuoteUpd')
urlpatterns = [
    path('', include(route.urls)),
]
