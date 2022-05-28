from django.urls import path
from hurb.base import views

app_name = 'base'
urlpatterns = [
    path('', views.home, name='home'),
]
