from django.contrib.admin import ModelAdmin
from django.contrib.admin import site

from currency.models import FictionalCurrency


class FictionalCurrencyAdmin(ModelAdmin):
    list_display = (
        'currency_short_name', 'currency_backing', 'currency_amount', 'created_at', 'updated_at'
    )
    search_fields = ('currency_short_name',)


site.register(FictionalCurrency, FictionalCurrencyAdmin)
