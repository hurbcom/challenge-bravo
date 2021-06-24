from django.urls import path, include
from rest_framework import routers
from rest_api import views

route = routers.DefaultRouter()
route.register(r'Currency', views.CurrencyViewSet, basename='Currency')
urlpatterns = [
    path('', include(route.urls)),
]
