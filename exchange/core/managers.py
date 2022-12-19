from django.db import models


class CoinbaseManager(models.Manager):
    def coinbase(self):
        """Manager that exclude fictional currencies.

        : return QuerySet
        """
        return self.all().exclude(type='fictional')
