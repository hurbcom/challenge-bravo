from django.db import models

from exchange.core.managers import CoinbaseManager


class Currency(models.Model):
    FIAT = 'fiat'
    CRYPTO = 'crypto'
    FICTIONAL = 'fictional'
    TYPES = (
        (FIAT, 'FIAT'),
        (CRYPTO, 'Crypto'),
        (FICTIONAL,'Fictional'),
    )

    code = models.CharField(max_length=10, unique=True, db_index=True)
    rate = models.FloatField()
    type = models.CharField(max_length=50, choices=TYPES, default=FIAT)
    backed_to = models.CharField(max_length=10, default='USD')
    updated_at = models.DateTimeField(auto_now=True)

    objects = CoinbaseManager()

    class Meta:
        ordering = ['pk']

    def convert_currency_rate_to_usd(self):
        """Convert the rate to USD that is backed to a different one.

        : return None
        """
        if self.backed_to != 'USD':
            backed_currency = Currency.objects.get(code=self.backed_to)
            self.rate *= backed_currency.rate

    def __str__(self):
        return self.code
