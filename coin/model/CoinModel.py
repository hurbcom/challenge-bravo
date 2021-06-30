from django.db import models

class CoinModel(models.Model):
    coin = models.CharField(max_length=100, blank=False, null=False, unique=True)
    coin_initials = models.CharField(max_length=100, blank=False, null=False, unique=True)
    amount_coint_bslt = models.FloatField(blank=False, null=False, default=1)
    price = models.FloatField(blank=False, null=False)
    country = models.CharField(max_length=100, blank=False, null=False)
    country_initials = models.CharField(max_length=100, blank=False, null=False)
    is_active = models.BooleanField(default=1, blank=False, null=False)
    bslt = models.CharField(max_length=100, blank=False, null=False, unique=False)

    class Meta:
        db_table = 'coin'