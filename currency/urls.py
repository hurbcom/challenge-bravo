from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.CurrencyList.as_view(), name='list'),
    url(r'^(?P<symbol>.*)/$', views.CurrencyDetail.as_view(), name='detail')
]