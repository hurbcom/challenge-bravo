app_name = 'app'
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf.urls import url
router = DefaultRouter()
from convert.api.ConvertViewSet import ConvertViewSet
from coin.api.CoinViewSet import CointViewSet



urlpatterns = [
    path('', include(router.urls)),
    url(r'^convert/', ConvertViewSet.as_view({"get": "convert"})),

    url(r'^coin/list/', CointViewSet.as_view({"get": "list"})),
    url(r'^coin/create/', CointViewSet.as_view({"post": "create"})),
    url(r'^coin/update/(?P<pk>[0-9]+|)/$', CointViewSet.as_view({"put": "update"})),
    url(r'^coin/update_all_coin/', CointViewSet.as_view({"put": "update_all_coin"})),
    url(r'^coin/delete/(?P<pk>\w+|)/$', CointViewSet.as_view({"delete": "delete"})),
]
