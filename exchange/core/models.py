from django.db import models


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

    def convert_currency_rate_to_usd(self):
        if self.backed_to != 'USD':
            backed_currency = Currency.objects.get(code=self.backed_to)
            self.rate *= backed_currency.rate

    def __str__(self):
        return self.code
