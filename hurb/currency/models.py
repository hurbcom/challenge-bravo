from django.db import models


class Currency(models.Model):
    name = models.CharField(max_length=32)
    value = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Base Value (R$)')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Currencies'
