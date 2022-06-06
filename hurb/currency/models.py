from django.db import models


class Currency(models.Model):
    name = models.CharField(max_length=32)
    value = models.DecimalField(max_digits=5, decimal_places=2, verbose_name='Base Value (R$)')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Currencies'
