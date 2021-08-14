from django.urls import path

from .views import converter, new

app_name = 'site'

urlpatterns = [
    path('', converter, name='index'),
    path('new', new, name='new')
]
