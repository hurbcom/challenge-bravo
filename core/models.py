from decimal import Decimal

from django.db import models


class Currency(models.Model):
    symbol = models.CharField(
        max_length=10,
        verbose_name='Symbol',
        unique=True,
    )
    is_base = models.BooleanField(verbose_name='Base Currency', db_index=True)
    value = models.DecimalField(
        max_digits=25,
        decimal_places=12,
        verbose_name='Value comparing to Base',
    )
    last_updated = models.DateTimeField(auto_now=True)

    def to(self, amount, symbol):
        base_value = self.value
        destiny_value = Currency.objects.filter(symbol=symbol).values_list(
            'value',
            flat=True,
        ).get()
        return Decimal(amount * base_value) / destiny_value

    def save(self, **kwargs):
        if self.is_base:  # Only one Currency can be the Base
            Currency.objects.filter(is_base=True).update(is_base=False)
        return super().save(**kwargs)
