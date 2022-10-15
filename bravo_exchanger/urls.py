from django.contrib import admin
from django.urls import include
from django.urls import path


urlpatterns = [
    path('', include('currency.urls')),
    path('admin/', admin.site.urls),
    path('api/', include('currency.api.urls')),
]
