from django.contrib import admin
from .models import Currency, CurrencyExchange

admin.site.register(Currency)
admin.site.register(CurrencyExchange)
