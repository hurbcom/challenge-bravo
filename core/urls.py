from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic.base import RedirectView
from rest_framework import permissions
from rest_framework.authtoken.views import obtain_auth_token
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
    openapi.Info(
        title="Challenge Bravo API",
        default_version="v1",
        description="Challenge Bravo API Documentation",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path(
        "docs/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path("admin/", admin.site.urls),
    path("api/", include("exchange.urls")),
    path("api-auth/", include("rest_framework.urls")),
    path("api-token-auth/", obtain_auth_token, name="api_token_auth"),
    re_path(r"^.*$", RedirectView.as_view(url="/docs/", permanent=False)),
]

admin.site.site_header = "Challenge Bravo Admin"
admin.site.site_title = "Challenge Bravo Admin Portal"
admin.site.index_title = "Welcome to Challenge Bravo Portal"
