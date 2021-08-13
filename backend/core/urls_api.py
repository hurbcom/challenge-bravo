from django.urls.conf import include, path
from rest_framework.routers import DefaultRouter

from .views_api import MyCoinViewSet


app_name = 'core'

router = DefaultRouter()
router.register(r'converter', MyCoinViewSet, basename='coin')


urlpatterns = [
    path('', include(router.urls)),
]
