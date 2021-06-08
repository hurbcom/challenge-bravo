from django.db import models


class Coin(models.Model):
    code = models.TextField(primary_key=True, max_length=10)
    name = models.TextField(max_length=30)
    value = models.DecimalField(max_digits=10, decimal_places=8)

    class Meta:
        ordering = ['name']
