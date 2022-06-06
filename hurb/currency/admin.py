from django.contrib.admin import ModelAdmin, register

from hurb.currency.models import Currency


@register(Currency)
class CurrencyAdmin(ModelAdmin):
    list_display = ('name', 'value',)
