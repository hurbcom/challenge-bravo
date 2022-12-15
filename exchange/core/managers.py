from django.db import models


class CoinbaseManager(models.Manager):
    def coinbase(self):
        return self.all().exclude(type='fictional')
