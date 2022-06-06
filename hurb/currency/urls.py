from django.urls import path

from hurb.currency.views import ConvertApiView

from django_boost.urls import register_boost_converters

register_boost_converters()

app_name = 'currency'
urlpatterns = [
    path('convert/from=<str:of>&to=<str:to>&amount=<float:amount>/', ConvertApiView.as_view(), name='convert'),
]
