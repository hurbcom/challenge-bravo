from django.urls import path

from .views import converter

app_name = 'site'

urlpatterns = [
    path('', converter, name='index'),
]
