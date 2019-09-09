from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.Converter.as_view(), name='converter'),
]